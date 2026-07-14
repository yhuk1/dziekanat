import { COMMISSION_STATUS } from "@/features/commissions/rules";
import { TASK_STATUS } from "@/features/tasks/rules";
import { prisma } from "@/lib/prisma";
import {
  RANKING_PAGE_SIZE,
  RANKING_TYPES,
  type RankingType,
  calculatePositionFromSortedValues,
  getRankingOffset,
} from "./rules";

export type RankingEntry = {
  position: number;
  studentId?: string;
  displayName: string;
  studyProgram: string;
  level: number;
  semester: number;
  value: number;
};

export type OwnRankingPosition = {
  position: number;
  value: number;
} | null;

type StudentMetric = {
  id: string;
  displayName: string;
  level: number;
  semester: number;
  studyProgram: { name: string };
};

function toEntry(student: StudentMetric, value: number, position: number): RankingEntry {
  return {
    position,
    studentId: student.id,
    displayName: student.displayName,
    studyProgram: student.studyProgram.name,
    level: student.level,
    semester: student.semester,
    value,
  };
}

export async function getRanking(type: RankingType, page: number, currentStudentId: string) {
  if (type === RANKING_TYPES.studyPrograms) {
    return getStudyProgramRanking(page);
  }

  if (
    type === RANKING_TYPES.level ||
    type === RANKING_TYPES.knowledge ||
    type === RANKING_TYPES.reputation
  ) {
    return getDirectStudentRanking(type, page, currentStudentId);
  }

  if (type === RANKING_TYPES.universityTasks) {
    return getCountRanking("universityTasks", page, currentStudentId);
  }

  return getCountRanking("commissions", page, currentStudentId);
}

async function getDirectStudentRanking(
  type: "level" | "knowledge" | "reputation",
  page: number,
  currentStudentId: string,
) {
  const offset = getRankingOffset(page);
  const [students, total, currentStudent, allValues] = await Promise.all([
    prisma.student.findMany({
      select: {
        id: true,
        displayName: true,
        level: true,
        semester: true,
        knowledge: true,
        reputation: true,
        studyProgram: { select: { name: true } },
      },
      orderBy: [{ [type]: "desc" }, { level: "desc" }, { displayName: "asc" }],
      skip: offset,
      take: RANKING_PAGE_SIZE,
    }),
    prisma.student.count(),
    prisma.student.findUnique({
      where: { id: currentStudentId },
      select: { level: true, knowledge: true, reputation: true },
    }),
    prisma.student.findMany({
      select: { [type]: true },
    }),
  ]);

  const entries = students.map((student, index) =>
    toEntry(student, Number(student[type]), offset + index + 1),
  );
  const ownValue = currentStudent ? Number(currentStudent[type]) : 0;
  const ownPosition = currentStudent
    ? {
        position: calculatePositionFromSortedValues(
          allValues.map((entry) => Number(entry[type])),
          ownValue,
        ),
        value: ownValue,
      }
    : null;

  return { entries, ownPosition, total };
}

async function getCountRanking(
  type: "universityTasks" | "commissions",
  page: number,
  currentStudentId: string,
) {
  const offset = getRankingOffset(page);
  const grouped =
    type === "universityTasks"
      ? await prisma.studentTask.groupBy({
          by: ["studentId"],
          where: { status: TASK_STATUS.completed },
          _count: { _all: true },
          orderBy: { _count: { studentId: "desc" } },
        })
      : await prisma.studentCommission.groupBy({
          by: ["contractorId"],
          where: { status: COMMISSION_STATUS.approved, contractorId: { not: null } },
          _count: { _all: true },
          orderBy: { _count: { contractorId: "desc" } },
        });

  const normalized = grouped
    .map((entry) => ({
      studentId: "studentId" in entry ? entry.studentId : (entry.contractorId as string | null),
      value: entry._count._all,
    }))
    .filter((entry): entry is { studentId: string; value: number } => Boolean(entry.studentId));

  const pageItems = normalized.slice(offset, offset + RANKING_PAGE_SIZE);
  const students = await prisma.student.findMany({
    where: { id: { in: pageItems.map((entry) => entry.studentId) } },
    select: {
      id: true,
      displayName: true,
      level: true,
      semester: true,
      studyProgram: { select: { name: true } },
    },
  });
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const entries = pageItems
    .map((entry, index) => {
      const student = studentMap.get(entry.studentId);
      return student ? toEntry(student, entry.value, offset + index + 1) : null;
    })
    .filter((entry): entry is RankingEntry => Boolean(entry));
  const ownValue = normalized.find((entry) => entry.studentId === currentStudentId)?.value ?? 0;
  const ownPosition =
    ownValue > 0
      ? {
          position: calculatePositionFromSortedValues(
            normalized.map((entry) => entry.value),
            ownValue,
          ),
          value: ownValue,
        }
      : null;

  return { entries, ownPosition, total: normalized.length };
}

async function getStudyProgramRanking(page: number) {
  const offset = getRankingOffset(page);
  const programs = await prisma.studyProgram.findMany({
    include: {
      students: {
        select: {
          level: true,
          knowledge: true,
          reputation: true,
        },
      },
    },
  });
  const ranked = programs
    .map((program) => ({
      studentId: program.id,
      displayName: program.name,
      studyProgram: program.name,
      level: program.students.length,
      semester: 0,
      value: program.students.reduce(
        (sum, student) => sum + student.level + student.knowledge + student.reputation,
        0,
      ),
    }))
    .sort((a, b) => b.value - a.value || a.displayName.localeCompare(b.displayName));

  return {
    entries: ranked.slice(offset, offset + RANKING_PAGE_SIZE).map((entry, index) => ({
      ...entry,
      position: offset + index + 1,
    })),
    ownPosition: null,
    total: ranked.length,
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/features/auth/session";
import { getStudentEquipmentBonuses, syncStudentEnergy } from "@/features/players/server";
import { TASK_STATUS } from "@/features/tasks/rules";
import { prisma } from "@/lib/prisma";
import { EXAM_STATUS, canApplySemesterAdvance, canAttemptExam, resolveExamAttempt } from "./rules";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`/exam?${type}=${encodeURIComponent(message)}`);
}

export async function attemptSemesterExamAction() {
  const { student } = await requireStudent();

  await prisma.$transaction(async (tx) => {
    const freshStudent = await syncStudentEnergy(tx, student.id);
    const [completedTasks, lastAttempt, equipmentBonuses] = await Promise.all([
      tx.studentTask.count({
        where: { studentId: student.id, status: TASK_STATUS.completed },
      }),
      tx.studentExamAttempt.findFirst({
        where: { studentId: student.id, semester: freshStudent.semester },
        orderBy: { createdAt: "desc" },
      }),
      getStudentEquipmentBonuses(tx, student.id),
    ]);

    const examStudent = {
      semester: freshStudent.semester,
      level: freshStudent.level,
      knowledge: freshStudent.knowledge,
      stress: freshStudent.stress,
      studyProgramSlug: freshStudent.studyProgram.slug,
    };
    const check = canAttemptExam(examStudent, completedTasks, lastAttempt, new Date());

    if (!check.ok) {
      redirectWithMessage("error", check.message ?? "Nie mozna podejsc do egzaminu.");
    }

    const now = new Date();
    const result = resolveExamAttempt(examStudent, equipmentBonuses, now);

    const attempt = await tx.studentExamAttempt.create({
      data: {
        studentId: student.id,
        semester: freshStudent.semester,
        status: result.status,
        score: result.score,
        requiredScore: result.requiredScore,
        narrative: result.narrative,
        knowledgeAtAttempt: freshStudent.knowledge,
        levelAtAttempt: freshStudent.level,
        stressAtAttempt: freshStudent.stress,
        nextAttemptAllowedAt: result.nextAttemptAllowedAt,
      },
    });

    let rewardMoney = 0;
    let rewardReputation = 0;

    if (canApplySemesterAdvance(freshStudent.semester, attempt.semester, attempt.status)) {
      const advance = await tx.student.updateMany({
        where: { id: student.id, semester: attempt.semester },
        data: {
          semester: { increment: 1 },
          stress: result.nextStress,
          money: { increment: result.rewardMoney },
          reputation: { increment: result.rewardReputation },
        },
      });

      if (advance.count === 1) {
        rewardMoney = result.rewardMoney;
        rewardReputation = result.rewardReputation;
      }
    } else if (result.status === EXAM_STATUS.failed) {
      await tx.student.update({
        where: { id: student.id },
        data: { stress: result.nextStress },
      });
    }

    await tx.studentRewardLog.create({
      data: {
        studentId: student.id,
        title:
          result.status === EXAM_STATUS.passed ? "Zdany egzamin semestralny" : "Niezdany egzamin",
        description:
          result.status === EXAM_STATUS.passed
            ? `Semestr ${freshStudent.semester} zaliczony. Awans na semestr ${result.nextSemester}.`
            : "Stres wzrosl, a prowadzacy zaprasza na kolejna probe po przerwie.",
        levelBefore: freshStudent.level,
        levelAfter: freshStudent.level,
        experienceChange: 0,
        moneyChange: rewardMoney,
        reputationChange: rewardReputation,
        knowledgeChange: 0,
        stressChange: result.nextStress - freshStudent.stress,
      },
    });
  });

  revalidatePath("/exam");
  revalidatePath("/dashboard");
  redirectWithMessage("success", "Egzamin rozliczony. Protokol trafil do systemu.");
}

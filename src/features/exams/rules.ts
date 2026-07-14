import { clampStress } from "../players/energy.ts";

export const EXAM_STATUS = {
  passed: "passed",
  failed: "failed",
} as const;

export type ExamStatus = (typeof EXAM_STATUS)[keyof typeof EXAM_STATUS];

export type SemesterRequirement = {
  semester: number;
  requiredLevel: number;
  requiredKnowledge: number;
  requiredCompletedTasks: number;
  requiredScore: number;
  rewardMoney: number;
  rewardReputation: number;
};

export const SEMESTER_REQUIREMENTS: SemesterRequirement[] = [
  {
    semester: 1,
    requiredLevel: 1,
    requiredKnowledge: 12,
    requiredCompletedTasks: 2,
    requiredScore: 65,
    rewardMoney: 40,
    rewardReputation: 5,
  },
  {
    semester: 2,
    requiredLevel: 2,
    requiredKnowledge: 24,
    requiredCompletedTasks: 5,
    requiredScore: 78,
    rewardMoney: 65,
    rewardReputation: 8,
  },
  {
    semester: 3,
    requiredLevel: 3,
    requiredKnowledge: 42,
    requiredCompletedTasks: 9,
    requiredScore: 92,
    rewardMoney: 90,
    rewardReputation: 12,
  },
  {
    semester: 4,
    requiredLevel: 4,
    requiredKnowledge: 64,
    requiredCompletedTasks: 14,
    requiredScore: 108,
    rewardMoney: 120,
    rewardReputation: 16,
  },
];

export type ExamStudentSnapshot = {
  semester: number;
  level: number;
  knowledge: number;
  stress: number;
  studyProgramSlug: string;
};

export type ExamBonuses = {
  knowledgeBonus: number;
  reputationBonus: number;
};

export type LastExamAttempt = {
  semester: number;
  status: string;
  nextAttemptAllowedAt: Date | null;
};

export function getSemesterRequirement(semester: number) {
  return (
    SEMESTER_REQUIREMENTS.find((requirement) => requirement.semester === semester) ??
    SEMESTER_REQUIREMENTS[SEMESTER_REQUIREMENTS.length - 1]
  );
}

export function canAttemptExam(
  student: ExamStudentSnapshot,
  completedTasks: number,
  lastAttempt: LastExamAttempt | null,
  now: Date,
) {
  const requirement = getSemesterRequirement(student.semester);

  if (student.level < requirement.requiredLevel) {
    return { ok: false, message: "Masz za niski poziom, zeby podejsc do egzaminu." };
  }

  if (student.knowledge < requirement.requiredKnowledge) {
    return { ok: false, message: "Masz za malo wiedzy. Notatki patrza z wyrzutem." };
  }

  if (completedTasks < requirement.requiredCompletedTasks) {
    return { ok: false, message: "Musisz wykonac wiecej zadan uczelni przed egzaminem." };
  }

  if (
    lastAttempt?.status === EXAM_STATUS.failed &&
    lastAttempt.nextAttemptAllowedAt &&
    lastAttempt.nextAttemptAllowedAt > now
  ) {
    return { ok: false, message: "Po porazce trzeba odczekac przed kolejna proba." };
  }

  return { ok: true };
}

export function getStudyProgramExamBonus(studyProgramSlug: string) {
  if (studyProgramSlug === "law") {
    return 4;
  }

  if (studyProgramSlug === "computer-science") {
    return 3;
  }

  if (studyProgramSlug === "medicine") {
    return 2;
  }

  return 0;
}

export function calculateExamScore(student: ExamStudentSnapshot, bonuses: ExamBonuses) {
  return (
    student.knowledge +
    bonuses.knowledgeBonus +
    student.level * 12 +
    getStudyProgramExamBonus(student.studyProgramSlug) +
    bonuses.reputationBonus -
    Math.floor(student.stress * 0.6)
  );
}

export function buildExamNarrative(score: number, requiredScore: number, passed: boolean) {
  const lines = [
    "Prowadzacy rozpoczyna od pytania, ktorego nie bylo w materialach.",
    "Uzywasz notatek od starszego rocznika.",
    score % 2 === 0 ? "Kalkulator odmawia wspolpracy." : "Przypominasz sobie slajd numer 137.",
    passed
      ? "Prowadzacy uznaje odpowiedz za wystarczajaco poprawna."
      : "Prowadzacy kiwa glowa w sposob, ktory nie zapowiada nic dobrego.",
    passed ? "Zdobywasz zaliczenie." : `Brakuje ${requiredScore - score} punktow do zaliczenia.`,
  ];

  return lines.join("\n");
}

export function resolveExamAttempt(student: ExamStudentSnapshot, bonuses: ExamBonuses, now: Date) {
  const requirement = getSemesterRequirement(student.semester);
  const score = calculateExamScore(student, bonuses);
  const passed = score >= requirement.requiredScore;
  const nextAttemptAllowedAt = passed ? null : new Date(now.getTime() + 60 * 60 * 1000);

  return {
    status: passed ? EXAM_STATUS.passed : EXAM_STATUS.failed,
    score,
    requiredScore: requirement.requiredScore,
    narrative: buildExamNarrative(score, requirement.requiredScore, passed),
    nextAttemptAllowedAt,
    nextStress: passed ? Math.max(0, student.stress - 5) : clampStress(student.stress + 12),
    nextSemester: passed ? student.semester + 1 : student.semester,
    rewardMoney: passed ? requirement.rewardMoney : 0,
    rewardReputation: passed ? requirement.rewardReputation : 0,
  };
}

export function canApplySemesterAdvance(
  currentSemester: number,
  attemptSemester: number,
  status: string,
) {
  return status === EXAM_STATUS.passed && currentSemester === attemptSemester;
}

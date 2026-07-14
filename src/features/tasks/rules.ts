import { applyExperience } from "../../lib/game-foundation.ts";
import { clampStress } from "../players/energy.ts";

export const TASK_STATUS = {
  inProgress: "in_progress",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export type TaskStudentSnapshot = {
  level: number;
  experience: number;
  knowledge: number;
  energy: number;
  maximumEnergy?: number;
  stress: number;
  reputation: number;
  money: number;
};

export type TaskDefinitionSnapshot = {
  category?: string;
  minimumLevel: number;
  energyCost: number;
  durationSeconds?: number;
  experienceReward?: number;
  moneyReward?: number;
  reputationReward?: number;
  knowledgeReward?: number;
  stressChange?: number;
};

export type EquipmentRewardBonuses = {
  moneyRewardBonus: number;
  reputationBonus: number;
  knowledgeBonus: number;
  taskTimeBonus: number;
};

export type ActiveTaskSnapshot = {
  status: string;
  finishesAt: Date;
  experienceReward: number;
  moneyReward: number;
  reputationReward: number;
  knowledgeReward: number;
  stressChange: number;
};

export type TaskRuleResult = {
  ok: boolean;
  message?: string;
};

export function canStartUniversityTask(
  student: Pick<TaskStudentSnapshot, "level" | "energy" | "stress">,
  task: TaskDefinitionSnapshot,
  activeTask?: { id: string } | null,
): TaskRuleResult {
  if (activeTask) {
    return {
      ok: false,
      message: "Masz juz aktywne zadanie. Najpierw zakoncz obecna misje akademicka.",
    };
  }

  if (student.level < task.minimumLevel) {
    return {
      ok: false,
      message: "To zadanie wymaga wyzszego poziomu. Dziekanat sugeruje grind edukacyjny.",
    };
  }

  if (student.energy < task.energyCost) {
    return {
      ok: false,
      message: "Masz za malo energii. Nawet najlepszy student czasem musi usiasc.",
    };
  }

  return { ok: true };
}

export function canClaimUniversityTask(
  task: Pick<ActiveTaskSnapshot, "status" | "finishesAt">,
  now: Date,
) {
  if (task.status !== TASK_STATUS.inProgress) {
    return {
      ok: false,
      message: "Nagroda za to zadanie zostala juz rozliczona albo zadanie nie jest aktywne.",
    };
  }

  if (task.finishesAt > now) {
    return {
      ok: false,
      message: "Zadanie nadal trwa. Nie da sie przyspieszyc pieczatki samym patrzeniem.",
    };
  }

  return { ok: true };
}

export function applyStudyProgramBonus(task: TaskDefinitionSnapshot, studyProgramSlug: string) {
  const rewards = {
    experienceReward: task.experienceReward ?? 0,
    moneyReward: task.moneyReward ?? 0,
    reputationReward: task.reputationReward ?? 0,
    knowledgeReward: task.knowledgeReward ?? 0,
    stressChange: task.stressChange ?? 0,
  };

  if (studyProgramSlug === "computer-science" && task.category === "Projekt") {
    rewards.knowledgeReward += Math.ceil(rewards.knowledgeReward * 0.1);
  }

  if (studyProgramSlug === "management") {
    rewards.moneyReward += Math.ceil(rewards.moneyReward * 0.08);
  }

  if (studyProgramSlug === "law" && task.category === "Dziekanat") {
    rewards.reputationReward += Math.ceil(rewards.reputationReward * 0.1);
  }

  if (studyProgramSlug === "graphic-design" && task.category === "Projekt") {
    rewards.moneyReward += Math.ceil(rewards.moneyReward * 0.1);
    rewards.knowledgeReward += Math.ceil(rewards.knowledgeReward * 0.1);
  }

  return rewards;
}

export function applyEquipmentTaskBonuses(
  rewards: ReturnType<typeof applyStudyProgramBonus>,
  task: TaskDefinitionSnapshot,
  equipmentBonuses: EquipmentRewardBonuses,
) {
  return {
    ...rewards,
    moneyReward:
      rewards.moneyReward +
      Math.ceil(rewards.moneyReward * (equipmentBonuses.moneyRewardBonus / 100)),
    reputationReward: rewards.reputationReward + equipmentBonuses.reputationBonus,
    knowledgeReward: rewards.knowledgeReward + equipmentBonuses.knowledgeBonus,
    durationSeconds:
      (task.durationSeconds ?? 0) -
      Math.floor((task.durationSeconds ?? 0) * (equipmentBonuses.taskTimeBonus / 100)),
  };
}

export function applyUniversityTaskRewards(student: TaskStudentSnapshot, task: ActiveTaskSnapshot) {
  const leveled = applyExperience(student.level, student.experience, task.experienceReward);

  return {
    level: leveled.level,
    experience: leveled.experience,
    knowledge: student.knowledge + task.knowledgeReward,
    money: student.money + task.moneyReward,
    reputation: student.reputation + task.reputationReward,
    stress: clampStress(student.stress + task.stressChange),
  };
}

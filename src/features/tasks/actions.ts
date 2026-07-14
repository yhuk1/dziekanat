"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireStudent } from "@/features/auth/session";
import { getStudentEquipmentBonuses, syncStudentEnergy } from "@/features/players/server";
import { prisma } from "@/lib/prisma";
import {
  TASK_STATUS,
  applyEquipmentTaskBonuses,
  applyStudyProgramBonus,
  applyUniversityTaskRewards,
  canClaimUniversityTask,
  canStartUniversityTask,
} from "./rules";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`/tasks?${type}=${encodeURIComponent(message)}`);
}

export async function startUniversityTaskAction(formData: FormData) {
  const { student } = await requireStudent();
  const taskId = String(formData.get("taskId") ?? "");

  if (!taskId) {
    redirectWithMessage("error", "Nie wybrano zadania.");
  }

  await prisma.$transaction(async (tx) => {
    const [freshStudent, task, activeTask] = await Promise.all([
      syncStudentEnergy(tx, student.id),
      tx.universityTask.findFirst({
        where: { id: taskId, isActive: true },
      }),
      tx.studentTask.findFirst({
        where: { studentId: student.id, status: TASK_STATUS.inProgress },
        select: { id: true },
      }),
    ]);

    if (!freshStudent) {
      throw new Error("Student not found for authenticated user.");
    }

    if (!task) {
      redirectWithMessage("error", "To zadanie nie istnieje albo zostalo zdjete z tablicy.");
    }

    const result = canStartUniversityTask(freshStudent, task, activeTask);

    if (!result.ok) {
      redirectWithMessage("error", result.message ?? "Nie mozna rozpoczac zadania.");
    }

    const now = new Date();

    const energyUpdate = await tx.student.updateMany({
      where: { id: student.id, energy: { gte: task.energyCost } },
      data: {
        energy: { decrement: task.energyCost },
        lastEnergyUpdateAt: now,
      },
    });

    if (energyUpdate.count !== 1) {
      redirectWithMessage("error", "Masz za malo energii. Stan konta zmienil sie w trakcie.");
    }

    const equipmentBonuses = await getStudentEquipmentBonuses(tx, student.id, task.category);
    const rewards = applyEquipmentTaskBonuses(
      applyStudyProgramBonus(task, freshStudent.studyProgram.slug),
      task,
      equipmentBonuses,
    );
    const adjustedDurationSeconds = Math.max(60, rewards.durationSeconds);

    try {
      await tx.studentTask.create({
        data: {
          studentId: student.id,
          universityTaskId: task.id,
          status: TASK_STATUS.inProgress,
          activeSlot: "active",
          startedAt: now,
          finishesAt: new Date(now.getTime() + adjustedDurationSeconds * 1000),
          experienceReward: rewards.experienceReward,
          moneyReward: rewards.moneyReward,
          reputationReward: rewards.reputationReward,
          knowledgeReward: rewards.knowledgeReward,
          stressChange: rewards.stressChange,
          energyCost: task.energyCost,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        redirectWithMessage("error", "Masz juz aktywne zadanie. Najpierw zakoncz obecne.");
      }

      throw error;
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  redirectWithMessage("success", "Zadanie rozpoczete. Energia pobrana, wymowki nie.");
}

export async function claimUniversityTaskRewardAction(formData: FormData) {
  const { student } = await requireStudent();
  const studentTaskId = String(formData.get("studentTaskId") ?? "");

  if (!studentTaskId) {
    redirectWithMessage("error", "Nie znaleziono aktywnego zadania.");
  }

  await prisma.$transaction(async (tx) => {
    const studentTask = await tx.studentTask.findFirst({
      where: {
        id: studentTaskId,
        studentId: student.id,
      },
    });

    if (!studentTask) {
      redirectWithMessage("error", "Nie znaleziono tego zadania na Twoim koncie.");
    }

    const claimCheck = canClaimUniversityTask(studentTask, new Date());

    if (!claimCheck.ok) {
      redirectWithMessage("error", claimCheck.message ?? "Nie mozna odebrac nagrody.");
    }

    const freshStudent = await syncStudentEnergy(tx, student.id);

    if (!freshStudent) {
      throw new Error("Student not found for authenticated user.");
    }

    const now = new Date();
    const completed = await tx.studentTask.updateMany({
      where: {
        id: studentTask.id,
        studentId: student.id,
        status: TASK_STATUS.inProgress,
        finishesAt: { lte: now },
      },
      data: {
        status: TASK_STATUS.completed,
        activeSlot: null,
        completedAt: now,
      },
    });

    if (completed.count !== 1) {
      redirectWithMessage("error", "Nagroda za to zadanie zostala juz rozliczona.");
    }

    const nextStats = applyUniversityTaskRewards(freshStudent, studentTask);
    const leveledUp = nextStats.level > freshStudent.level;

    await tx.student.update({
      where: { id: student.id },
      data: nextStats,
    });

    await tx.studentRewardLog.create({
      data: {
        studentId: student.id,
        studentTaskId: studentTask.id,
        title: leveledUp ? "Awans na poziom!" : "Nagroda za zadanie",
        description: leveledUp
          ? `Poziom ${freshStudent.level} -> ${nextStats.level}. Dziekanat odnotowal niepokojacy rozwoj.`
          : "Nagrody dopisane do indeksu.",
        levelBefore: freshStudent.level,
        levelAfter: nextStats.level,
        experienceChange: studentTask.experienceReward,
        moneyChange: studentTask.moneyReward,
        reputationChange: studentTask.reputationReward,
        knowledgeChange: studentTask.knowledgeReward,
        stressChange: studentTask.stressChange,
      },
    });
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  redirectWithMessage("success", "Nagroda odebrana. Indeks lekko sie usmiechnal.");
}

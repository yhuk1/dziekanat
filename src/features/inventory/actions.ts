"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/features/auth/session";
import { getStudentEquipmentBonuses, syncStudentEnergy } from "@/features/players/server";
import { prisma } from "@/lib/prisma";
import { applyConsumableEffect, canEquipInventoryItem, canUseConsumable } from "./rules";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`/inventory?${type}=${encodeURIComponent(message)}`);
}

export async function equipInventoryItemAction(formData: FormData) {
  const { student } = await requireStudent();
  const inventoryItemId = String(formData.get("inventoryItemId") ?? "");

  if (!inventoryItemId) {
    redirectWithMessage("error", "Nie wybrano przedmiotu.");
  }

  await prisma.$transaction(async (tx) => {
    const inventoryItem = await tx.studentInventoryItem.findFirst({
      where: { id: inventoryItemId, studentId: student.id },
      include: { item: true },
    });

    if (!inventoryItem) {
      redirectWithMessage("error", "Ten przedmiot nie nalezy do Twojej postaci.");
    }

    const existingEquipment = await tx.studentEquipment.findMany({
      where: { studentId: student.id },
      select: { slot: true, inventoryItemId: true },
    });

    const result = canEquipInventoryItem(inventoryItem, existingEquipment);

    if (!result.ok) {
      redirectWithMessage("error", result.message ?? "Nie mozna wyposazyc przedmiotu.");
    }

    await tx.studentEquipment.upsert({
      where: { inventoryItemId: inventoryItem.id },
      create: {
        studentId: student.id,
        inventoryItemId: inventoryItem.id,
        slot: inventoryItem.item.slot ?? "unknown",
      },
      update: {
        slot: inventoryItem.item.slot ?? "unknown",
      },
    });
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  redirectWithMessage("success", "Przedmiot wyposazony. Wyglada profesjonalnie.");
}

export async function unequipInventoryItemAction(formData: FormData) {
  const { student } = await requireStudent();
  const inventoryItemId = String(formData.get("inventoryItemId") ?? "");

  if (!inventoryItemId) {
    redirectWithMessage("error", "Nie wybrano przedmiotu.");
  }

  await prisma.studentEquipment.deleteMany({
    where: {
      studentId: student.id,
      inventoryItemId,
    },
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  redirectWithMessage("success", "Przedmiot zdjety. Slot odetchnal.");
}

export async function useConsumableItemAction(formData: FormData) {
  const { student } = await requireStudent();
  const inventoryItemId = String(formData.get("inventoryItemId") ?? "");

  if (!inventoryItemId) {
    redirectWithMessage("error", "Nie wybrano przedmiotu.");
  }

  await prisma.$transaction(async (tx) => {
    const freshStudent = await syncStudentEnergy(tx, student.id);
    const inventoryItem = await tx.studentInventoryItem.findFirst({
      where: { id: inventoryItemId },
      include: { item: true },
    });

    if (!inventoryItem) {
      redirectWithMessage("error", "Nie znaleziono przedmiotu.");
    }

    const result = canUseConsumable(inventoryItem, student.id);

    if (!result.ok) {
      redirectWithMessage("error", result.message ?? "Nie mozna uzyc przedmiotu.");
    }

    const equipmentBonuses = await getStudentEquipmentBonuses(tx, student.id);
    const nextStats = applyConsumableEffect(
      {
        ...freshStudent,
        maximumEnergy: freshStudent.maximumEnergy + equipmentBonuses.maximumEnergyBonus,
      },
      inventoryItem.item,
    );
    const energyChange = nextStats.energy - freshStudent.energy;
    const stressChange = nextStats.stress - freshStudent.stress;

    await tx.student.update({
      where: { id: student.id },
      data: {
        energy: nextStats.energy,
        stress: nextStats.stress,
        lastEnergyUpdateAt: new Date(),
      },
    });

    if (inventoryItem.quantity <= 1) {
      await tx.studentInventoryItem.delete({
        where: { id: inventoryItem.id },
      });
    } else {
      await tx.studentInventoryItem.update({
        where: { id: inventoryItem.id },
        data: { quantity: { decrement: 1 } },
      });
    }

    await tx.studentRewardLog.create({
      data: {
        studentId: student.id,
        title: `Uzyto: ${inventoryItem.item.name}`,
        description:
          "Przedmiot jednorazowy zniknal z ekwipunku zgodnie z prawami akademickiej fizyki.",
        levelBefore: freshStudent.level,
        levelAfter: freshStudent.level,
        experienceChange: 0,
        moneyChange: 0,
        reputationChange: 0,
        knowledgeChange: 0,
        stressChange,
        energyChange,
      },
    });
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  redirectWithMessage("success", "Przedmiot uzyty. Organizm zlozyl podanie o dalsza prace.");
}

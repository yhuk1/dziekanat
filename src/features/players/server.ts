import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { aggregateEquipmentBonuses } from "../inventory/rules";
import { calculateServerEnergy } from "./energy";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

export async function syncStudentEnergy(
  client: PrismaExecutor,
  studentId: string,
  now = new Date(),
) {
  const student = await client.student.findUnique({
    where: { id: studentId },
    include: {
      studyProgram: true,
      equippedItems: {
        include: {
          inventoryItem: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  const equipmentBonuses = aggregateEquipmentBonuses(
    student.equippedItems.map((equipment) => equipment.inventoryItem.item),
  );
  const effectiveMaximumEnergy = student.maximumEnergy + equipmentBonuses.maximumEnergyBonus;

  const energyState = calculateServerEnergy(
    {
      energy: student.energy,
      maximumEnergy: effectiveMaximumEnergy,
      stress: student.stress,
      lastEnergyUpdateAt: student.lastEnergyUpdateAt,
      studyProgramSlug: student.studyProgram.slug,
      energyRegenBonus: equipmentBonuses.energyRegenBonus,
    },
    now,
  );

  if (
    energyState.energy !== student.energy ||
    energyState.lastEnergyUpdateAt.getTime() !== student.lastEnergyUpdateAt.getTime()
  ) {
    return client.student.update({
      where: { id: studentId },
      data: {
        energy: energyState.energy,
        lastEnergyUpdateAt: energyState.lastEnergyUpdateAt,
      },
      include: {
        studyProgram: true,
        equippedItems: {
          include: {
            inventoryItem: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });
  }

  return student;
}

export async function getStudentEquipmentBonuses(
  client: PrismaExecutor,
  studentId: string,
  taskCategory?: string,
) {
  const equippedItems = await client.studentEquipment.findMany({
    where: { studentId },
    include: {
      inventoryItem: {
        include: { item: true },
      },
    },
  });

  return aggregateEquipmentBonuses(
    equippedItems.map((equipment) => equipment.inventoryItem.item),
    taskCategory,
  );
}

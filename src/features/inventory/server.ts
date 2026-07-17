import type { Prisma } from "@prisma/client";
import type { ItemSource } from "./rules";

export async function grantInventoryItem(
  tx: Prisma.TransactionClient,
  input: {
    studentId: string;
    itemId: string;
    source: ItemSource;
    message: string;
    quantity?: number;
  },
) {
  const quantity = Math.max(1, input.quantity ?? 1);

  const inventoryItem = await tx.studentInventoryItem.upsert({
    where: {
      studentId_itemId: {
        studentId: input.studentId,
        itemId: input.itemId,
      },
    },
    create: {
      studentId: input.studentId,
      itemId: input.itemId,
      quantity,
    },
    update: {
      quantity: { increment: quantity },
    },
  });

  await tx.studentItemLog.create({
    data: {
      studentId: input.studentId,
      itemId: input.itemId,
      source: input.source,
      quantity,
      message: input.message,
    },
  });

  return inventoryItem;
}

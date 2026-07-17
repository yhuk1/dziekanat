"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/features/auth/session";
import { ITEM_SOURCE, canBuyShopOffer } from "@/features/inventory/rules";
import { grantInventoryItem } from "@/features/inventory/server";
import { syncStudentEnergy } from "@/features/players/server";
import { prisma } from "@/lib/prisma";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`/shop?${type}=${encodeURIComponent(message)}`);
}

export async function buyShopItemAction(formData: FormData) {
  const { student } = await requireStudent();
  const offerId = String(formData.get("offerId") ?? "");

  if (!offerId) {
    redirectWithMessage("error", "Nie wybrano przedmiotu ze sklepu.");
  }

  let itemName = "";

  await prisma.$transaction(async (tx) => {
    const [freshStudent, offer] = await Promise.all([
      syncStudentEnergy(tx, student.id),
      tx.shopOffer.findFirst({
        where: { id: offerId, isActive: true },
        include: { item: true },
      }),
    ]);

    if (!freshStudent) {
      throw new Error("Student not found for authenticated user.");
    }

    if (!offer) {
      redirectWithMessage("error", "Ta oferta nie istnieje albo zniknela z polki.");
    }

    const existingItem = await tx.studentInventoryItem.findUnique({
      where: {
        studentId_itemId: {
          studentId: student.id,
          itemId: offer.itemId,
        },
      },
      select: { studentId: true, quantity: true },
    });

    const buyCheck = canBuyShopOffer(freshStudent, offer, existingItem);

    if (!buyCheck.ok) {
      redirectWithMessage("error", buyCheck.message ?? "Nie mozna kupic tego przedmiotu.");
    }

    const payment = await tx.student.updateMany({
      where: { id: student.id, money: { gte: offer.price } },
      data: { money: { decrement: offer.price } },
    });

    if (payment.count !== 1) {
      redirectWithMessage("error", "Ktos przestawil cennik albo gotowka wyparowala.");
    }

    await grantInventoryItem(tx, {
      studentId: student.id,
      itemId: offer.itemId,
      source: ITEM_SOURCE.shop,
      message: `Zakup w sklepie uczelnianym za ${offer.price} zl`,
    });

    itemName = offer.item.name;
  });

  revalidatePath("/shop");
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  redirectWithMessage("success", `Kupiono przedmiot: ${itemName}`);
}

"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/session";
import { COMMISSION_STATUS } from "@/features/commissions/rules";
import { prisma } from "@/lib/prisma";
import { ADMIN_ACTION, canAdminCancelCommission, canToggleUserBlock } from "./rules";
import { getAdminItemInput, getAdminTaskInput } from "./validation";

function redirectWithMessage(path: string, type: "error" | "success", message: string): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function writeAuditLog(
  tx: Prisma.TransactionClient,
  adminUserId: string,
  data: {
    action: string;
    targetType: string;
    targetId?: string | null;
    details: string;
    economyChange?: boolean;
  },
) {
  await tx.adminAuditLog.create({
    data: {
      adminUserId,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      details: data.details,
      economyChange: data.economyChange ?? false,
    },
  });
}

function getUniqueErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Taki slug albo unikalna wartosc juz istnieje.";
  }

  return null;
}

export async function toggleUserBlockAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = getString(formData, "userId");
  const shouldBlock = getString(formData, "intent") === "block";

  await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isBlocked: true },
    });

    if (!target) {
      redirectWithMessage("/admin", "error", "Nie znaleziono konta.");
    }

    const check = canToggleUserBlock(admin, target, shouldBlock);

    if (!check.ok) {
      redirectWithMessage("/admin", "error", check.message ?? "Nie mozna zmienic blokady.");
    }

    await tx.user.update({
      where: { id: target.id },
      data: { isBlocked: shouldBlock },
    });

    if (shouldBlock) {
      await tx.session.deleteMany({ where: { userId: target.id } });
    }

    await writeAuditLog(tx, admin.id, {
      action: shouldBlock ? ADMIN_ACTION.blockUser : ADMIN_ACTION.unblockUser,
      targetType: "User",
      targetId: target.id,
      details: `${shouldBlock ? "Zablokowano" : "Odblokowano"} konto ${target.email}.`,
    });
  });

  revalidatePath("/admin");
  redirectWithMessage(
    "/admin",
    "success",
    shouldBlock ? "Konto zablokowane." : "Konto odblokowane.",
  );
}

export async function saveUniversityTaskAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const result = getAdminTaskInput(formData);
  const path = "/admin/tasks";

  if (!result.success) {
    redirectWithMessage(path, "error", result.error.issues[0]?.message ?? "Sprawdz dane zadania.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const task = result.data.id
        ? await tx.universityTask.update({
            where: { id: result.data.id },
            data: result.data,
          })
        : await tx.universityTask.create({
            data: result.data,
          });

      await writeAuditLog(tx, admin.id, {
        action: result.data.id ? ADMIN_ACTION.updateTask : ADMIN_ACTION.createTask,
        targetType: "UniversityTask",
        targetId: task.id,
        details: `${result.data.id ? "Zmieniono" : "Utworzono"} zadanie: ${task.title}.`,
        economyChange: true,
      });
    });
  } catch (error) {
    const message = getUniqueErrorMessage(error);

    if (message) {
      redirectWithMessage(path, "error", message);
    }

    throw error;
  }

  revalidatePath(path);
  revalidatePath("/tasks");
  redirectWithMessage(path, "success", "Zadanie zapisane. Dziekanat przybil cyfrowa pieczatke.");
}

export async function disableUniversityTaskAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const taskId = getString(formData, "taskId");

  await prisma.$transaction(async (tx) => {
    const task = await tx.universityTask.update({
      where: { id: taskId },
      data: { isActive: false },
    });

    await writeAuditLog(tx, admin.id, {
      action: ADMIN_ACTION.disableTask,
      targetType: "UniversityTask",
      targetId: task.id,
      details: `Wylaczono zadanie: ${task.title}.`,
      economyChange: true,
    });
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/tasks");
  redirectWithMessage("/admin/tasks", "success", "Zadanie wylaczone.");
}

export async function saveItemDefinitionAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const result = getAdminItemInput(formData);
  const path = "/admin/items";

  if (!result.success) {
    redirectWithMessage(
      path,
      "error",
      result.error.issues[0]?.message ?? "Sprawdz dane przedmiotu.",
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = result.data.id
        ? await tx.itemDefinition.update({
            where: { id: result.data.id },
            data: result.data,
          })
        : await tx.itemDefinition.create({
            data: result.data,
          });

      await writeAuditLog(tx, admin.id, {
        action: result.data.id ? ADMIN_ACTION.updateItem : ADMIN_ACTION.createItem,
        targetType: "ItemDefinition",
        targetId: item.id,
        details: `${result.data.id ? "Zmieniono" : "Utworzono"} przedmiot: ${item.name}.`,
        economyChange: true,
      });
    });
  } catch (error) {
    const message = getUniqueErrorMessage(error);

    if (message) {
      redirectWithMessage(path, "error", message);
    }

    throw error;
  }

  revalidatePath(path);
  revalidatePath("/inventory");
  redirectWithMessage(path, "success", "Przedmiot zapisany. Magazyn akademicki mrugnal swiatlem.");
}

export async function cancelCommissionAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const commissionId = getString(formData, "commissionId");

  await prisma.$transaction(async (tx) => {
    const commission = await tx.studentCommission.findUnique({
      where: { id: commissionId },
      include: { creator: { select: { displayName: true } } },
    });

    if (!commission) {
      redirectWithMessage("/admin/commissions", "error", "Nie znaleziono zlecenia.");
    }

    const check = canAdminCancelCommission(commission);

    if (!check.ok) {
      redirectWithMessage(
        "/admin/commissions",
        "error",
        check.message ?? "Nie mozna anulowac zlecenia.",
      );
    }

    const updated = await tx.studentCommission.updateMany({
      where: {
        id: commission.id,
        status: { notIn: [COMMISSION_STATUS.approved, COMMISSION_STATUS.cancelled] },
      },
      data: { status: COMMISSION_STATUS.cancelled, cancelledAt: new Date() },
    });

    if (updated.count !== 1) {
      redirectWithMessage("/admin/commissions", "error", "Zlecenie zostalo juz rozliczone.");
    }

    await tx.student.update({
      where: { id: commission.creatorId },
      data: { money: { increment: commission.moneyReward } },
    });

    await writeAuditLog(tx, admin.id, {
      action: ADMIN_ACTION.cancelCommission,
      targetType: "StudentCommission",
      targetId: commission.id,
      details: `Anulowano zlecenie "${commission.title}" i zwrocono depozyt ${commission.moneyReward} zl dla ${commission.creator.displayName}.`,
      economyChange: true,
    });
  });

  revalidatePath("/admin/commissions");
  revalidatePath("/commissions");
  revalidatePath("/dashboard");
  redirectWithMessage("/admin/commissions", "success", "Zlecenie anulowane, depozyt zwrocony.");
}

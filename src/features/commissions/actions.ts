"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import {
  COMMISSION_STATUS,
  canAcceptCommission,
  canApproveCommission,
  canCancelCommission,
  canCreateCommission,
  canSubmitCommission,
} from "./rules";
import { getCreateCommissionInput } from "./validation";

function redirectWithMessage(path: string, type: "error" | "success", message: string): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function syncOverdueCommissions(now = new Date()) {
  await prisma.studentCommission.updateMany({
    where: {
      status: { in: [COMMISSION_STATUS.open, COMMISSION_STATUS.accepted] },
      deadlineAt: { lt: now },
    },
    data: { status: COMMISSION_STATUS.overdue },
  });
}

export async function createCommissionAction(formData: FormData) {
  const { student } = await requireStudent();
  const result = getCreateCommissionInput(formData);

  if (!result.success) {
    redirectWithMessage(
      "/commissions/new",
      "error",
      result.error.issues[0]?.message ?? "Sprawdz dane zlecenia.",
    );
  }

  if (result.data.deadlineAt <= new Date()) {
    redirectWithMessage("/commissions/new", "error", "Termin musi byc w przyszlosci.");
  }

  await prisma.$transaction(async (tx) => {
    const freshStudent = await tx.student.findUnique({
      where: { id: student.id },
      select: { money: true },
    });

    if (!freshStudent) {
      throw new Error("Student not found.");
    }

    const createCheck = canCreateCommission(freshStudent, result.data.moneyReward);

    if (!createCheck.ok) {
      redirectWithMessage(
        "/commissions/new",
        "error",
        createCheck.message ?? "Nie mozna utworzyc zlecenia.",
      );
    }

    const depositUpdate = await tx.student.updateMany({
      where: { id: student.id, money: { gte: result.data.moneyReward } },
      data: { money: { decrement: result.data.moneyReward } },
    });

    if (depositUpdate.count !== 1) {
      redirectWithMessage(
        "/commissions/new",
        "error",
        "Masz za malo pieniedzy na depozyt zlecenia.",
      );
    }

    await tx.studentCommission.create({
      data: {
        creatorId: student.id,
        title: result.data.title,
        description: result.data.description,
        category: result.data.category,
        minimumLevel: result.data.minimumLevel,
        deadlineAt: result.data.deadlineAt,
        moneyReward: result.data.moneyReward,
      },
    });
  });

  revalidatePath("/commissions");
  revalidatePath("/commissions/created");
  revalidatePath("/dashboard");
  redirectWithMessage(
    "/commissions/created",
    "success",
    "Zlecenie opublikowane, depozyt zabezpieczony.",
  );
}

export async function acceptCommissionAction(formData: FormData) {
  const { student } = await requireStudent();
  const commissionId = String(formData.get("commissionId") ?? "");

  if (!commissionId) {
    redirectWithMessage("/commissions", "error", "Nie wybrano zlecenia.");
  }

  await prisma.$transaction(async (tx) => {
    const commission = await tx.studentCommission.findUnique({ where: { id: commissionId } });

    if (!commission) {
      redirectWithMessage("/commissions", "error", "Nie znaleziono zlecenia.");
    }

    const acceptCheck = canAcceptCommission(student, commission, new Date());

    if (!acceptCheck.ok) {
      redirectWithMessage(
        "/commissions",
        "error",
        acceptCheck.message ?? "Nie mozna przyjac zlecenia.",
      );
    }

    const updated = await tx.studentCommission.updateMany({
      where: { id: commission.id, status: COMMISSION_STATUS.open, contractorId: null },
      data: {
        contractorId: student.id,
        status: COMMISSION_STATUS.accepted,
        acceptedAt: new Date(),
      },
    });

    if (updated.count !== 1) {
      redirectWithMessage("/commissions", "error", "Ktos byl szybszy i przyjal to zlecenie.");
    }
  });

  revalidatePath("/commissions");
  revalidatePath("/commissions/accepted");
  redirectWithMessage(
    "/commissions/accepted",
    "success",
    "Zlecenie przyjete. Czas udawac profesjonaliste.",
  );
}

export async function submitCommissionAction(formData: FormData) {
  const { student } = await requireStudent();
  const commissionId = String(formData.get("commissionId") ?? "");

  await prisma.$transaction(async (tx) => {
    const commission = await tx.studentCommission.findUnique({ where: { id: commissionId } });

    if (!commission) {
      redirectWithMessage("/commissions/accepted", "error", "Nie znaleziono zlecenia.");
    }

    const submitCheck = canSubmitCommission(student.id, commission, new Date());

    if (!submitCheck.ok) {
      redirectWithMessage(
        "/commissions/accepted",
        "error",
        submitCheck.message ?? "Nie mozna oznaczyc zlecenia jako wykonane.",
      );
    }

    await tx.studentCommission.update({
      where: { id: commission.id },
      data: { status: COMMISSION_STATUS.submitted, submittedAt: new Date() },
    });
  });

  revalidatePath("/commissions/accepted");
  revalidatePath("/commissions/created");
  redirectWithMessage("/commissions/accepted", "success", "Zlecenie oznaczone jako wykonane.");
}

export async function approveCommissionAction(formData: FormData) {
  const { student } = await requireStudent();
  const commissionId = String(formData.get("commissionId") ?? "");

  await prisma.$transaction(async (tx) => {
    const commission = await tx.studentCommission.findUnique({ where: { id: commissionId } });

    if (!commission) {
      redirectWithMessage("/commissions/created", "error", "Nie znaleziono zlecenia.");
    }

    const approveCheck = canApproveCommission(student.id, commission);

    if (!approveCheck.ok) {
      redirectWithMessage(
        "/commissions/created",
        "error",
        approveCheck.message ?? "Nie mozna zatwierdzic zlecenia.",
      );
    }

    const updated = await tx.studentCommission.updateMany({
      where: { id: commission.id, status: COMMISSION_STATUS.submitted },
      data: { status: COMMISSION_STATUS.approved, approvedAt: new Date() },
    });

    if (updated.count !== 1) {
      redirectWithMessage("/commissions/created", "error", "Nagroda zostala juz rozliczona.");
    }

    await tx.student.update({
      where: { id: commission.contractorId ?? "" },
      data: { money: { increment: commission.moneyReward } },
    });
  });

  revalidatePath("/commissions/created");
  revalidatePath("/commissions/accepted");
  revalidatePath("/dashboard");
  redirectWithMessage(
    "/commissions/created",
    "success",
    "Zlecenie zatwierdzone, nagroda wyplacona.",
  );
}

export async function cancelCommissionAction(formData: FormData) {
  const { student } = await requireStudent();
  const commissionId = String(formData.get("commissionId") ?? "");

  await prisma.$transaction(async (tx) => {
    const commission = await tx.studentCommission.findUnique({ where: { id: commissionId } });

    if (!commission) {
      redirectWithMessage("/commissions/created", "error", "Nie znaleziono zlecenia.");
    }

    const cancelCheck = canCancelCommission(student.id, commission);

    if (!cancelCheck.ok) {
      redirectWithMessage(
        "/commissions/created",
        "error",
        cancelCheck.message ?? "Nie mozna anulowac zlecenia.",
      );
    }

    const updated = await tx.studentCommission.updateMany({
      where: { id: commission.id, status: COMMISSION_STATUS.open },
      data: { status: COMMISSION_STATUS.cancelled, cancelledAt: new Date() },
    });

    if (updated.count !== 1) {
      redirectWithMessage(
        "/commissions/created",
        "error",
        "Zlecenie nie jest juz dostepne do anulowania.",
      );
    }

    await tx.student.update({
      where: { id: student.id },
      data: { money: { increment: commission.moneyReward } },
    });
  });

  revalidatePath("/commissions");
  revalidatePath("/commissions/created");
  revalidatePath("/dashboard");
  redirectWithMessage(
    "/commissions/created",
    "success",
    "Zlecenie anulowane, depozyt wrocil do portfela.",
  );
}

"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { ITEM_SOURCE, canGrantStarterItems, getStarterItemSlugs } from "@/features/inventory/rules";
import { grantInventoryItem } from "@/features/inventory/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_STUDENT_STATS } from "./rules";
import { getCreateStudentInput } from "./validation";

function getErrorRedirect(message: string) {
  return `/student/create?error=${encodeURIComponent(message)}`;
}

export async function createStudentAction(formData: FormData) {
  const user = await requireUser();
  const result = getCreateStudentInput(formData);

  if (!result.success) {
    redirect(getErrorRedirect(result.error.issues[0]?.message ?? "Sprawdz dane postaci."));
  }

  const existingStudent = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (existingStudent) {
    redirect("/dashboard");
  }

  const studyProgram = await prisma.studyProgram.findUnique({
    where: { id: result.data.studyProgramId },
    select: { id: true, slug: true },
  });

  if (!studyProgram) {
    redirect(getErrorRedirect("Wybrany kierunek nie istnieje. Dziekanat udaje zaskoczenie."));
  }

  try {
    await prisma.$transaction(async (tx) => {
      const starterCheck = canGrantStarterItems({ starterItemsGranted: false });

      if (!starterCheck.ok) {
        throw new Error("Starter item grant unexpectedly rejected.");
      }

      const createdStudent = await tx.student.create({
        data: {
          userId: user.id,
          studyProgramId: studyProgram.id,
          displayName: result.data.displayName,
          starterItemsGranted: true,
          ...INITIAL_STUDENT_STATS,
        },
      });

      const starterItems = await tx.itemDefinition.findMany({
        where: { slug: { in: getStarterItemSlugs(studyProgram.slug) }, isActive: true },
        select: { id: true, name: true },
      });

      for (const item of starterItems) {
        await grantInventoryItem(tx, {
          studentId: createdStudent.id,
          itemId: item.id,
          source: ITEM_SOURCE.starter,
          message: `Zestaw startowy: ${item.name}`,
        });
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect("/dashboard");
    }

    throw error;
  }

  redirect("/dashboard");
}

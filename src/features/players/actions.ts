"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/features/auth/session";
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
    select: { id: true },
  });

  if (!studyProgram) {
    redirect(getErrorRedirect("Wybrany kierunek nie istnieje. Dziekanat udaje zaskoczenie."));
  }

  try {
    await prisma.student.create({
      data: {
        userId: user.id,
        studyProgramId: studyProgram.id,
        displayName: result.data.displayName,
        ...INITIAL_STUDENT_STATS,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect("/dashboard");
    }

    throw error;
  }

  redirect("/dashboard");
}

"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroyCurrentSession } from "./session";
import { getAuthInput } from "./validation";
import { hashPassword, verifyPassword } from "./password";

function getErrorRedirect(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

export async function registerAction(formData: FormData) {
  const result = getAuthInput(formData);

  if (!result.success) {
    redirect(getErrorRedirect("/register", result.error.issues[0]?.message ?? "Sprawdz dane."));
  }

  const passwordHash = await hashPassword(result.data.password);

  try {
    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        passwordHash,
      },
    });

    await createSession(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect(getErrorRedirect("/register", "Konto z tym adresem e-mail juz istnieje."));
    }

    throw error;
  }

  redirect("/student/create");
}

export async function loginAction(formData: FormData) {
  const result = getAuthInput(formData);

  if (!result.success) {
    redirect(getErrorRedirect("/login", "Nieprawidlowy e-mail lub haslo."));
  }

  const user = await prisma.user.findUnique({
    where: { email: result.data.email },
    include: { student: true },
  });

  if (!user || !(await verifyPassword(result.data.password, user.passwordHash))) {
    redirect(getErrorRedirect("/login", "Nieprawidlowy e-mail lub haslo."));
  }

  if (user.isBlocked) {
    redirect(
      getErrorRedirect("/login", "Konto jest zablokowane. Odwiedz dziekanat w godzinach odwagi."),
    );
  }

  await createSession(user.id);
  redirect(user.student ? "/dashboard" : "/student/create");
}

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/login");
}

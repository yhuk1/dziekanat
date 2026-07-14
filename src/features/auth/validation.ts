import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Podaj poprawny adres e-mail.")
  .max(120, "Adres e-mail jest za dlugi.");

export const passwordSchema = z
  .string()
  .min(8, "Haslo musi miec co najmniej 8 znakow.")
  .max(128, "Haslo jest za dlugie.");

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export function getAuthInput(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

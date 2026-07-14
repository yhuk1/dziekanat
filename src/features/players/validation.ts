import { z } from "zod";

export const createStudentSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Imie postaci musi miec co najmniej 2 znaki.")
    .max(40, "Imie postaci jest za dlugie.")
    .regex(/^[\p{L}0-9 _-]+$/u, "Uzyj liter, cyfr, spacji, myslnika albo podkreslenia."),
  studyProgramId: z.string().cuid("Wybierz poprawny kierunek studiow."),
});

export function getCreateStudentInput(formData: FormData) {
  return createStudentSchema.safeParse({
    displayName: formData.get("displayName"),
    studyProgramId: formData.get("studyProgramId"),
  });
}

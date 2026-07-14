import { z } from "zod";
import { COMMISSION_CATEGORIES } from "./rules";

export const createCommissionSchema = z.object({
  title: z.string().trim().min(4, "Tytul musi miec co najmniej 4 znaki.").max(80),
  description: z.string().trim().min(10, "Opis musi miec co najmniej 10 znakow.").max(800),
  category: z.enum(COMMISSION_CATEGORIES),
  minimumLevel: z.coerce.number().int().min(1).max(50),
  deadlineAt: z.coerce.date(),
  moneyReward: z.coerce.number().int().min(1).max(100000),
});

export function getCreateCommissionInput(formData: FormData) {
  return createCommissionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    minimumLevel: formData.get("minimumLevel"),
    deadlineAt: formData.get("deadlineAt"),
    moneyReward: formData.get("moneyReward"),
  });
}

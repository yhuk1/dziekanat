import { z } from "zod";

const text = (min: number, max: number) =>
  z.string().trim().min(min, "Pole jest wymagane.").max(max, "Tekst jest za dlugi.");

const intField = (name: string, min: number, max: number) =>
  z.coerce
    .number({ invalid_type_error: `${name}: wpisz liczbe.` })
    .int(`${name}: wpisz liczbe calkowita.`)
    .min(min, `${name}: wartosc jest za mala.`)
    .max(max, `${name}: wartosc jest za duza.`);

const optionalSlot = z
  .string()
  .trim()
  .max(40)
  .transform((value) => value || null);

export const adminTaskSchema = z.object({
  id: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug moze zawierac male litery, cyfry i myslniki.")
    .min(3)
    .max(80),
  title: text(3, 120),
  description: text(10, 600),
  category: text(3, 80),
  minimumLevel: intField("Poziom", 1, 100),
  durationSeconds: intField("Czas", 60, 86400),
  energyCost: intField("Energia", 0, 1000),
  experienceReward: intField("XP", 0, 100000),
  moneyReward: intField("Gotowka", 0, 100000),
  reputationReward: intField("Reputacja", 0, 100000),
  knowledgeReward: intField("Wiedza", 0, 100000),
  stressChange: intField("Stres", -100, 100),
  isActive: z.boolean(),
});

export const adminItemSchema = z.object({
  id: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug moze zawierac male litery, cyfry i myslniki.")
    .min(3)
    .max(80),
  name: text(3, 120),
  description: text(10, 600),
  category: text(3, 80),
  slot: optionalSlot,
  rarity: text(3, 60),
  knowledgeBonus: intField("Bonus wiedzy", 0, 1000),
  maximumEnergyBonus: intField("Bonus energii", 0, 1000),
  energyRegenBonus: intField("Bonus regeneracji", 0, 1000),
  reputationBonus: intField("Bonus reputacji", 0, 1000),
  moneyRewardBonus: intField("Bonus gotowki", 0, 1000),
  taskTimeBonus: intField("Bonus czasu", 0, 95),
  taskCategory: optionalSlot,
  energyRestore: intField("Odnawianie energii", 0, 1000),
  stressReduce: intField("Redukcja stresu", 0, 1000),
  isConsumable: z.boolean(),
  isActive: z.boolean(),
});

export function getBooleanField(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function getAdminTaskInput(formData: FormData) {
  return adminTaskSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    minimumLevel: formData.get("minimumLevel"),
    durationSeconds: formData.get("durationSeconds"),
    energyCost: formData.get("energyCost"),
    experienceReward: formData.get("experienceReward"),
    moneyReward: formData.get("moneyReward"),
    reputationReward: formData.get("reputationReward"),
    knowledgeReward: formData.get("knowledgeReward"),
    stressChange: formData.get("stressChange"),
    isActive: getBooleanField(formData, "isActive"),
  });
}

export function getAdminItemInput(formData: FormData) {
  return adminItemSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    slot: formData.get("slot"),
    rarity: formData.get("rarity"),
    knowledgeBonus: formData.get("knowledgeBonus"),
    maximumEnergyBonus: formData.get("maximumEnergyBonus"),
    energyRegenBonus: formData.get("energyRegenBonus"),
    reputationBonus: formData.get("reputationBonus"),
    moneyRewardBonus: formData.get("moneyRewardBonus"),
    taskTimeBonus: formData.get("taskTimeBonus"),
    taskCategory: formData.get("taskCategory"),
    energyRestore: formData.get("energyRestore"),
    stressReduce: formData.get("stressReduce"),
    isConsumable: getBooleanField(formData, "isConsumable"),
    isActive: getBooleanField(formData, "isActive"),
  });
}

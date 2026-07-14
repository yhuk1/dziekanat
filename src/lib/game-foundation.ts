export const STUDY_PROGRAM_PREVIEW = ["Informatyka", "Zarzadzanie", "Prawo", "Medycyna", "Grafika"];

export const UNIVERSITY_TASK_PREVIEW = [
  "Oddaj zalegly formularz",
  "Odbierz podpis z sekretariatu",
  "Przygotuj notatki dla grupy",
];

export function getRequiredExperience(level: number) {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error("Level must be a positive integer.");
  }

  return Math.floor(100 * Math.pow(level, 1.35));
}

export function applyExperience(
  currentLevel: number,
  currentExperience: number,
  gainedExperience: number,
) {
  if (currentExperience < 0 || gainedExperience < 0) {
    throw new Error("Experience values cannot be negative.");
  }

  let level = currentLevel;
  let experience = currentExperience + gainedExperience;

  while (experience >= getRequiredExperience(level)) {
    experience -= getRequiredExperience(level);
    level += 1;
  }

  return { level, experience };
}

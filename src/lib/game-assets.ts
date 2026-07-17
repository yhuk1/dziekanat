export const CHARACTER_IMAGE_BY_STUDY_PROGRAM: Record<string, string> = {
  "computer-science": "/images/characters/character-it.webp",
  management: "/images/characters/character-management.webp",
  law: "/images/characters/character-law.webp",
  medicine: "/images/characters/character-medicine.webp",
  "graphic-design": "/images/characters/character-art.webp",
};

export const TASK_CATEGORY_IMAGE_BY_NAME: Record<string, string> = {
  Wykład: "/images/tasks/task-category-lecture.webp",
  "WykÅ‚ad": "/images/tasks/task-category-lecture.webp",
  Projekt: "/images/tasks/task-category-project.webp",
  Dziekanat: "/images/tasks/task-category-dean-office.webp",
  "Koło naukowe": "/images/tasks/task-category-student-club.webp",
  "KoÅ‚o naukowe": "/images/tasks/task-category-student-club.webp",
  "Praca dorywcza": "/images/tasks/task-category-part-time-job.webp",
  "Wydarzenie uczelniane": "/images/tasks/task-category-campus-event.webp",
};

export const TASK_IMAGE_BY_SLUG: Record<string, string> = {
  "survive-8am-lecture": "/images/tasks/task-survive-morning-lecture.webp",
  "recover-lecturer-signature": "/images/tasks/task-get-signature.webp",
  "deliver-documents-to-office": "/images/tasks/task-deliver-documents.webp",
  "last-minute-presentation": "/images/tasks/task-last-minute-presentation.webp",
  "get-notes-from-older-year": "/images/tasks/task-get-old-notes.webp",
  "fix-group-project": "/images/tasks/task-fix-group-project.webp",
  "help-conference": "/images/tasks/task-organize-conference.webp",
  "defeat-campus-printer": "/images/tasks/task-printer-battle.webp",
};

export const ITEM_IMAGE_BY_SLUG: Record<string, string> = {
  "old-cousin-laptop": "/images/items/item-old-laptop.webp",
  "scientific-calculator": "/images/items/item-calculator.webp",
  "freshman-backpack": "/images/items/item-freshman-backpack.webp",
  "older-year-notes": "/images/items/item-old-student-notes.webp",
  "library-card": "/images/items/item-library-card.webp",
  "mystery-pendrive": "/images/items/item-mystery-pendrive.webp",
  "presentation-suit": "/images/items/item-presentation-suit.webp",
  "thermal-mug": "/images/items/item-thermal-mug.webp",
  "vending-machine-coffee": "/images/items/item-vending-coffee.webp",
  "pre-exam-energy-drink": "/images/items/item-exam-energy-drink.webp",
};

export function getStudyProgramImage(slug: string) {
  return CHARACTER_IMAGE_BY_STUDY_PROGRAM[slug];
}

export function getTaskImage(slug: string, category: string) {
  return TASK_IMAGE_BY_SLUG[slug] ?? TASK_CATEGORY_IMAGE_BY_NAME[category];
}

export function getItemImage(slug: string) {
  return ITEM_IMAGE_BY_SLUG[slug];
}

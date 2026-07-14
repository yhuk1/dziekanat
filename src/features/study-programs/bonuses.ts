export const STUDY_PROGRAM_BONUSES = {
  "computer-science": {
    label: "Informatyka: +10% wiedzy z projektow.",
    shortLabel: "+10% wiedzy z projektow",
  },
  management: {
    label: "Zarzadzanie: +8% pieniedzy ze wszystkich zadan.",
    shortLabel: "+8% pieniedzy",
  },
  law: {
    label: "Prawo: +10% reputacji z zadan dziekanatowych.",
    shortLabel: "+10% reputacji z dziekanatu",
  },
  medicine: {
    label: "Medycyna: energia regeneruje sie co 4 minuty zamiast co 5.",
    shortLabel: "szybsza regeneracja energii",
  },
  "graphic-design": {
    label: "Grafika: +10% pieniedzy i wiedzy z projektow kreatywnych.",
    shortLabel: "+10% z projektow kreatywnych",
  },
} as const;

export function getStudyProgramBonusLabel(slug: string) {
  return STUDY_PROGRAM_BONUSES[slug as keyof typeof STUDY_PROGRAM_BONUSES]?.label ?? "Brak bonusu.";
}

export const RANKING_PAGE_SIZE = 10;
export const MAX_RANKING_PAGE = 100;

export const RANKING_TYPES = {
  level: "level",
  knowledge: "knowledge",
  reputation: "reputation",
  universityTasks: "universityTasks",
  commissions: "commissions",
  studyPrograms: "studyPrograms",
} as const;

export type RankingType = (typeof RANKING_TYPES)[keyof typeof RANKING_TYPES];

export const RANKING_LABELS: Record<RankingType, string> = {
  level: "Najwyzszy poziom",
  knowledge: "Najwieksza wiedza",
  reputation: "Najwyzsza reputacja",
  universityTasks: "Wykonane zadania uczelni",
  commissions: "Wykonane zlecenia studentow",
  studyPrograms: "Ranking kierunkow",
};

export function parseRankingType(value?: string): RankingType {
  const allowed = Object.values(RANKING_TYPES);
  return allowed.includes(value as RankingType) ? (value as RankingType) : RANKING_TYPES.level;
}

export function parseRankingPage(value?: string) {
  const page = Number(value ?? "1");

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return Math.min(page, MAX_RANKING_PAGE);
}

export function getRankingOffset(page: number) {
  return (page - 1) * RANKING_PAGE_SIZE;
}

export function calculatePositionFromSortedValues(values: number[], ownValue: number) {
  const betterCount = values.filter((value) => value > ownValue).length;
  return betterCount + 1;
}

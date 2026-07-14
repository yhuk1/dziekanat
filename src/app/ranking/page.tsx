import Link from "next/link";
import { Trophy } from "lucide-react";
import { requireStudent } from "@/features/auth/session";
import { getRanking } from "@/features/ranking/queries";
import {
  RANKING_LABELS,
  RANKING_PAGE_SIZE,
  RANKING_TYPES,
  parseRankingPage,
  parseRankingType,
} from "@/features/ranking/rules";

type RankingPageProps = {
  searchParams: Promise<{ type?: string; page?: string }>;
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const { student } = await requireStudent();
  const params = await searchParams;
  const type = parseRankingType(params.type);
  const page = parseRankingPage(params.page);
  const ranking = await getRanking(type, page, student.id);
  const totalPages = Math.max(1, Math.ceil(ranking.total / RANKING_PAGE_SIZE));

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">Rankingi</p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Akademicka tablica chwaly
              </h1>
              <p className="mt-3 max-w-3xl text-ink/70">
                Dane pochodza z bazy i pokazuja tylko publiczne informacje postaci. E-maile zostaja
                w sekretariacie.
              </p>
            </div>
            <div className="rounded-md bg-paper px-4 py-3 text-sm font-bold text-ink/70">
              Twoj ranking:{" "}
              {ranking.ownPosition ? `#${ranking.ownPosition.position}` : "brak danych"}
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {Object.values(RANKING_TYPES).map((rankingType) => (
            <Link
              key={rankingType}
              href={`/ranking?type=${rankingType}`}
              className={
                rankingType === type
                  ? "rounded-md bg-accent px-4 py-2 text-sm font-black text-white"
                  : "rounded-md bg-ink px-4 py-2 text-sm font-black text-white hover:bg-accent"
              }
            >
              {RANKING_LABELS[rankingType]}
            </Link>
          ))}
        </nav>

        <section className="overflow-hidden rounded-lg border border-ink/10 bg-white/78 shadow-panel">
          <div className="grid grid-cols-[64px_1.2fr_1fr_80px_80px_110px] gap-3 bg-ink px-4 py-3 text-sm font-black text-white max-md:hidden">
            <span>#</span>
            <span>Postac</span>
            <span>Kierunek</span>
            <span>Poziom</span>
            <span>Semestr</span>
            <span>Wynik</span>
          </div>
          <div className="divide-y divide-ink/10">
            {ranking.entries.map((entry) => (
              <div
                key={`${entry.studentId ?? entry.displayName}-${entry.position}`}
                className="grid gap-3 px-4 py-4 md:grid-cols-[64px_1.2fr_1fr_80px_80px_110px] md:items-center"
              >
                <div className="flex items-center gap-2 font-black text-accent">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  {entry.position}
                </div>
                <div>
                  <p className="font-black text-ink">{entry.displayName}</p>
                  <p className="text-sm text-ink/55 md:hidden">{entry.studyProgram}</p>
                </div>
                <p className="hidden text-ink/70 md:block">{entry.studyProgram}</p>
                <p className="font-bold text-ink/70">Poziom {entry.level}</p>
                <p className="font-bold text-ink/70">
                  {entry.semester ? `Sem. ${entry.semester}` : "-"}
                </p>
                <p className="rounded-md bg-paper px-3 py-2 text-sm font-black text-ink">
                  {entry.value}
                </p>
              </div>
            ))}
          </div>
          {ranking.entries.length === 0 ? (
            <p className="p-5 text-ink/65">
              Brak wynikow. Ranking czeka na pierwsze legendy korytarza.
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-between gap-3">
          <PageLink
            type={type}
            page={Math.max(1, page - 1)}
            disabled={page <= 1}
            label="Poprzednia"
          />
          <span className="text-sm font-bold text-ink/60">
            Strona {page} z {totalPages}
          </span>
          <PageLink
            type={type}
            page={Math.min(totalPages, page + 1)}
            disabled={page >= totalPages}
            label="Nastepna"
          />
        </div>
      </section>
    </div>
  );
}

function PageLink({
  type,
  page,
  disabled,
  label,
}: {
  type: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="rounded-md bg-ink/10 px-4 py-2 text-sm font-black text-ink/35">{label}</span>
    );
  }

  return (
    <Link
      href={`/ranking?type=${type}&page=${page}`}
      className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white hover:bg-accent"
    >
      {label}
    </Link>
  );
}

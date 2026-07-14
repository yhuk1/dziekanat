import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, GraduationCap, ShieldCheck } from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { STUDY_PROGRAM_PREVIEW, UNIVERSITY_TASK_PREVIEW } from "@/lib/game-foundation";

export default function HomePage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="rounded-lg border border-ink/10 bg-white/72 p-6 shadow-panel backdrop-blur md:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            RPG uczelniane bez smutnego indeksu
          </div>
          <h1 className="max-w-3xl text-4xl font-black tracking-normal text-ink sm:text-5xl lg:text-6xl">
            Dziekanat: Gra o Zaliczenie
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
            Przetrwaj semestr. Zdobadz zaliczenie. Pokonaj dziekanat.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">
            Rozwijaj studenta, pilnuj energii i reputacji, a potem udowodnij, ze formularz zlozony w
            terminie to nie mit, tylko build produkcyjny charakteru.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Zaloz konto
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-ink/15 bg-white/70 px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Mam juz indeks
            </Link>
            <a
              href="#foundation"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-ink/15 bg-white/70 px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Zobacz fundament
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-panel">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50">Podglad indeksu</p>
              <h2 className="mt-1 text-2xl font-black">Student testowy</h2>
            </div>
            <span className="rounded-md bg-success px-3 py-2 text-sm font-black">Semestr 1</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Energia" value="100/100" tone="light" />
            <StatCard label="Stres" value="0" tone="light" />
            <StatCard label="Reputacja" value="0" tone="light" />
            <StatCard label="Gotowka" value="50 zl" tone="light" />
          </div>
          <div className="mt-5 rounded-lg bg-white/8 p-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Doswiadczenie do poziomu 2</span>
              <span>0 / 100</span>
            </div>
            <ProgressBar value={0} max={100} className="mt-3" />
          </div>
        </div>
      </section>

      <section id="foundation" className="mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-3">
        <FeatureCard
          icon={ShieldCheck}
          title="Dane w bazie"
          description="Prisma i SQLite sa gotowe na konta, studentow, kierunki oraz zadania uczelni."
        />
        <FeatureCard
          icon={Clock3}
          title="Petla MVP"
          description="Struktura wspiera koszt energii, czas zadania, nagrody i historie wykonania."
        />
        <FeatureCard
          icon={BookOpen}
          title="Polski klimat"
          description="UI mowi po polsku, a kod zostaje po angielsku, zeby przyszle moduly byly czytelne."
        />
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white/72 p-5 shadow-panel">
          <h2 className="text-xl font-black">Kierunki przygotowane w seedzie</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STUDY_PROGRAM_PREVIEW.map((program) => (
              <div
                key={program}
                className="rounded-md border border-ink/10 bg-paper p-3 font-semibold"
              >
                {program}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white/72 p-5 shadow-panel">
          <h2 className="text-xl font-black">Pierwsze zadania uczelni</h2>
          <div className="mt-4 space-y-3">
            {UNIVERSITY_TASK_PREVIEW.map((task) => (
              <div
                key={task}
                className="rounded-md border border-ink/10 bg-paper p-3 font-semibold"
              >
                {task}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

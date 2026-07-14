import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Coins,
  Flame,
  GraduationCap,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { requireStudent } from "@/features/auth/session";
import { aggregateEquipmentBonuses } from "@/features/inventory/rules";
import { getEffectiveEnergyRegenSeconds } from "@/features/players/energy";
import { syncStudentEnergy } from "@/features/players/server";
import { getStudyProgramBonusLabel } from "@/features/study-programs/bonuses";
import { getRequiredExperience } from "@/lib/game-foundation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { student: sessionStudent } = await requireStudent();
  const student = await syncStudentEnergy(prisma, sessionStudent.id);
  const rewardLogs = await prisma.studentRewardLog.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const equipmentBonuses = aggregateEquipmentBonuses(
    student.equippedItems.map((equipment) => equipment.inventoryItem.item),
  );
  const effectiveMaximumEnergy = student.maximumEnergy + equipmentBonuses.maximumEnergyBonus;
  const requiredExperience = getRequiredExperience(student.level);
  const regenMinutes = Math.ceil(
    getEffectiveEnergyRegenSeconds(
      student.stress,
      student.studyProgram.slug,
      equipmentBonuses.energyRegenBonus,
    ) / 60,
  );
  const stats = [
    { label: "Poziom", value: String(student.level), icon: GraduationCap },
    { label: "Energia", value: `${student.energy}/${effectiveMaximumEnergy}`, icon: Zap },
    { label: "Stres", value: String(student.stress), icon: Flame },
    { label: "Wiedza", value: String(student.knowledge), icon: BookOpen },
    { label: "Reputacja", value: String(student.reputation), icon: Star },
    { label: "Gotowka", value: `${student.money} zl`, icon: Coins },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel backdrop-blur md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Panel gracza
              </p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                {student.displayName}, indeks czeka na czyny
              </h1>
              <p className="mt-3 max-w-2xl text-ink/70">
                Kierunek: <strong>{student.studyProgram.name}</strong>. Dziekanat obserwuje, ale na
                razie tylko z umiarkowanym zainteresowaniem.
              </p>
            </div>
            <div className="rounded-md bg-ink px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-widest text-white/55">Semestr</p>
              <p className="text-2xl font-black">{student.semester}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Doswiadczenie</span>
              <span>
                {student.experience} / {requiredExperience}
              </span>
            </div>
            <ProgressBar value={student.experience} max={requiredExperience} className="mt-3" />
            <div className="mt-5 grid gap-3">
              <div className="rounded-md bg-paper p-4">
                <p className="text-sm font-bold text-ink/55">Kierunek</p>
                <p className="mt-1 text-lg font-black">{student.studyProgram.name}</p>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  {getStudyProgramBonusLabel(student.studyProgram.slug)}
                </p>
              </div>
              <div className="rounded-md bg-paper p-4">
                <p className="text-sm font-bold text-ink/55">Status</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-black">
                  <Trophy className="h-5 w-5 text-accent" aria-hidden="true" />
                  Gotowy na pierwsze zadania
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  Energia odnawia sie co ok. {regenMinutes} min, maksymalnie do{" "}
                  {effectiveMaximumEnergy}. Wysoki stres spowalnia regeneracje.
                </p>
              </div>
            </div>
          </div>

          <EmptyState
            icon={ClipboardList}
            title="Zadania od uczelni sa gotowe"
            description="Wybierz aktywnosc, zuzyj energie i odbierz nagrode po czasie zapisanym w bazie."
          />
          <Link
            href="/tasks"
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-black text-white shadow-lg shadow-ink/15 transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 lg:col-start-2"
          >
            Przejdz do zadan
          </Link>
        </div>

        <section className="mt-5 rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
          <h2 className="text-2xl font-black text-ink">Dziennik ostatnich zmian</h2>
          {rewardLogs.length > 0 ? (
            <div className="mt-4 divide-y divide-ink/10">
              {rewardLogs.map((log) => (
                <div key={log.id} className="py-3">
                  <p className="font-black text-ink">{log.title}</p>
                  <p className="text-sm text-ink/65">{log.description}</p>
                  <p className="mt-1 text-sm font-bold text-ink/55">
                    XP +{log.experienceChange}, wiedza +{log.knowledgeChange}, reputacja +
                    {log.reputationChange}, gotowka +{log.moneyChange} zl, stres{" "}
                    {log.stressChange >= 0 ? "+" : ""}
                    {log.stressChange}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-ink/65">
              Dziennik jest pusty. Jeszcze nikt nie wpisal pieczatki do systemu.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

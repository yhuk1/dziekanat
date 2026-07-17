import Image from "next/image";
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
import { ResourceBar } from "@/components/ui/resource-bar";
import { StatCard } from "@/components/ui/stat-card";
import { requireStudent } from "@/features/auth/session";
import { aggregateEquipmentBonuses } from "@/features/inventory/rules";
import { getEffectiveEnergyRegenSeconds } from "@/features/players/energy";
import { syncStudentEnergy } from "@/features/players/server";
import { getStudyProgramBonusLabel } from "@/features/study-programs/bonuses";
import { getStudyProgramImage } from "@/lib/game-assets";
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
  const characterImage = getStudyProgramImage(student.studyProgram.slug);

  return (
    <div className="dashboard-game-background">
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="game-card-dark overflow-hidden p-5 md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-amber-200">
                  Panel gracza
                </p>
                <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  {student.displayName}, indeks czeka na czyny
                </h1>
                <p className="mt-3 max-w-2xl text-white/78">
                  Kierunek: <strong>{student.studyProgram.name}</strong>. Dziekanat obserwuje, ale
                  na razie tylko z umiarkowanym zainteresowaniem.
                </p>
              </div>
              <div className="rounded-md border border-white/15 bg-white/12 px-4 py-3 text-white shadow-lg shadow-ink/20 backdrop-blur">
                <p className="text-xs uppercase tracking-widest text-white/55">Semestr</p>
                <p className="text-2xl font-black">{student.semester}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <ResourceBar
              label="Energia"
              value={student.energy}
              max={effectiveMaximumEnergy}
              icon={Zap}
              tone="energy"
              helpText={`Regeneracja co ok. ${regenMinutes} min`}
            />
            <ResourceBar
              label="Stres"
              value={student.stress}
              max={100}
              icon={Flame}
              tone="stress"
              helpText="Nie tylko kolor: wysoki stres spowalnia regeneracje"
            />
            <ResourceBar
              label="Doswiadczenie"
              value={student.experience}
              max={requiredExperience}
              icon={Trophy}
              tone="experience"
              helpText={`Do poziomu ${student.level + 1}`}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats
              .filter((stat) => !["Energia", "Stres"].includes(stat.label))
              .map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
              ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="game-card p-5">
              <div className="mt-5 grid gap-3">
                {characterImage ? (
                  <div className="relative h-72 overflow-hidden rounded-lg border border-ink/10 bg-paper sm:h-80">
                    <Image
                      src={characterImage}
                      alt={`Portret postaci kierunku ${student.studyProgram.name}`}
                      fill
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="object-contain p-2"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/72 to-transparent p-4">
                      <p className="text-sm font-black uppercase tracking-widest text-white/78">
                        Profil postaci
                      </p>
                    </div>
                  </div>
                ) : null}
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

          <section className="game-card mt-5 p-5">
            <h2 className="text-2xl font-black text-ink">Dziennik ostatnich zmian</h2>
            {rewardLogs.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {rewardLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-ink/10 bg-paper p-4">
                    <p className="font-black text-ink">
                      {log.title.includes("Awans") ? "Awans! " : ""}
                      {log.title}
                    </p>
                    <p className="text-sm text-ink/65">{log.description}</p>
                    <p className="mt-2 rounded-md bg-white/70 px-3 py-2 text-sm font-bold text-ink/65">
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
    </div>
  );
}

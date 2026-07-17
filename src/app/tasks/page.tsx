import Image from "next/image";
import { BookOpen, Clock3, Coins, History, Star, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ResourceBar } from "@/components/ui/resource-bar";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import { aggregateEquipmentBonuses } from "@/features/inventory/rules";
import { getEffectiveEnergyRegenSeconds } from "@/features/players/energy";
import { syncStudentEnergy } from "@/features/players/server";
import { getStudyProgramBonusLabel } from "@/features/study-programs/bonuses";
import {
  claimUniversityTaskRewardAction,
  startUniversityTaskAction,
} from "@/features/tasks/actions";
import { TASK_STATUS, applyStudyProgramBonus } from "@/features/tasks/rules";
import { TaskCountdown } from "@/features/tasks/task-countdown";
import { getTaskImage } from "@/lib/game-assets";
import { prisma } from "@/lib/prisma";

type TasksPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { student: sessionStudent } = await requireStudent();
  const student = await syncStudentEnergy(prisma, sessionStudent.id);
  const params = await searchParams;
  const now = new Date();
  const equipmentBonuses = aggregateEquipmentBonuses(
    student.equippedItems.map((equipment) => equipment.inventoryItem.item),
  );
  const effectiveMaximumEnergy = student.maximumEnergy + equipmentBonuses.maximumEnergyBonus;
  const regenMinutes = Math.ceil(
    getEffectiveEnergyRegenSeconds(
      student.stress,
      student.studyProgram.slug,
      equipmentBonuses.energyRegenBonus,
    ) / 60,
  );

  const [tasks, activeTask, history] = await Promise.all([
    prisma.universityTask.findMany({
      where: { isActive: true },
      orderBy: [{ minimumLevel: "asc" }, { energyCost: "asc" }, { title: "asc" }],
    }),
    prisma.studentTask.findFirst({
      where: { studentId: student.id, status: TASK_STATUS.inProgress },
      include: { universityTask: true },
      orderBy: { startedAt: "desc" },
    }),
    prisma.studentTask.findMany({
      where: { studentId: student.id, status: TASK_STATUS.completed },
      include: { universityTask: true },
      orderBy: { completedAt: "desc" },
      take: 8,
    }),
  ]);

  const canClaimActiveTask = activeTask ? activeTask.finishesAt <= now : false;
  const activeTaskImage = activeTask
    ? getTaskImage(activeTask.universityTask.slug, activeTask.universityTask.category)
    : null;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="game-card p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Zadania od uczelni
              </p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Tablica spraw pilnych, dziwnych i punktowanych
              </h1>
              <p className="mt-3 max-w-3xl text-ink/70">
                Start zadania, koszt energii i czas zakonczenia liczy serwer. Przegladarka moze
                odpoczac, zadanie i tak zostaje w bazie.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <span className="game-chip">Poziom {student.level}</span>
              <span className="game-chip">
                Energia {student.energy}/{effectiveMaximumEnergy}
              </span>
              <span className="game-chip">Wiedza {student.knowledge}</span>
              <span className="game-chip">Stres {student.stress}</span>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-paper px-4 py-3 text-sm font-semibold text-ink/70">
            Bonus kierunku: {getStudyProgramBonusLabel(student.studyProgram.slug)} Energia odnawia
            sie co ok. {regenMinutes} min i nie przekroczy limitu {effectiveMaximumEnergy}.
          </div>
        </div>

        <StatusMessage error={params.error} success={params.success} />

        {activeTask ? (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-5 shadow-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {activeTaskImage ? (
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-ink/10 bg-paper lg:w-72 lg:shrink-0">
                  <Image
                    src={activeTaskImage}
                    alt={`Ilustracja aktywnego zadania: ${activeTask.universityTask.title}`}
                    fill
                    sizes="(min-width: 1024px) 288px, 100vw"
                    className="object-cover object-[center_35%] md:object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/52 to-transparent" />
                </div>
              ) : null}
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-accent">
                  Aktywne zadanie
                </p>
                <h2 className="mt-2 text-2xl font-black text-ink">
                  {activeTask.universityTask.title}
                </h2>
                <p className="mt-2 max-w-3xl text-ink/70">
                  {activeTask.universityTask.description}
                </p>
              </div>
              <div className="rounded-lg border border-ink/10 bg-white/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Pozostalo</p>
                <p className="mt-1 text-2xl">
                  <TaskCountdown finishesAt={activeTask.finishesAt.toISOString()} />
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <RewardBadge
                icon={BookOpen}
                label="Wiedza"
                value={`+${activeTask.knowledgeReward}`}
              />
              <RewardBadge icon={Coins} label="Gotowka" value={`+${activeTask.moneyReward} zl`} />
              <RewardBadge
                icon={Star}
                label="Reputacja"
                value={`+${activeTask.reputationReward}`}
              />
            </div>
            <form action={claimUniversityTaskRewardAction} className="mt-5">
              <input type="hidden" name="studentTaskId" value={activeTask.id} />
              <SubmitButton
                pendingLabel="Odbieranie nagrody..."
                className={canClaimActiveTask ? "bg-success hover:bg-ink" : ""}
              >
                {canClaimActiveTask ? "Odbierz nagrode" : "Sprawdz, czy juz koniec"}
              </SubmitButton>
            </form>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => {
            const rewards = applyStudyProgramBonus(task, student.studyProgram.slug);
            const lockedByLevel = student.level < task.minimumLevel;
            const lockedByEnergy = student.energy < task.energyCost;
            const lockedByActive = Boolean(activeTask);
            const disabled = lockedByLevel || lockedByEnergy || lockedByActive;
            const taskImage = getTaskImage(task.slug, task.category);

            return (
              <article
                key={task.id}
                className="game-card flex flex-col p-5 transition hover:-translate-y-1"
              >
                {taskImage ? (
                  <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-lg border-b border-ink/10 bg-paper">
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={taskImage}
                        alt={`Ilustracja zadania: ${task.title}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-[center_35%] md:object-center"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" />
                    </div>
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <span className="game-chip-accent">{task.category}</span>
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                    lvl {task.minimumLevel}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-black text-ink">{task.title}</h2>
                <p className="mt-2 flex-1 leading-7 text-ink/70">{task.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                    <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
                    {Math.ceil(task.durationSeconds / 60)} min
                  </span>
                  <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                    <Zap className="h-4 w-4 text-accent" aria-hidden="true" />
                    {task.energyCost} energii
                  </span>
                  <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                    <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />+
                    {rewards.knowledgeReward} wiedzy
                  </span>
                  <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                    <Coins className="h-4 w-4 text-accent" aria-hidden="true" />+
                    {rewards.moneyReward} zl
                  </span>
                  <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                    <Star className="h-4 w-4 text-accent" aria-hidden="true" />+
                    {rewards.reputationReward} rep.
                  </span>
                  <span className="rounded-md bg-paper px-3 py-2 font-bold">
                    +{rewards.experienceReward} XP
                  </span>
                </div>

                <div className="mt-4">
                  <ResourceBar
                    label="Koszt energii"
                    value={Math.min(task.energyCost, effectiveMaximumEnergy)}
                    max={effectiveMaximumEnergy}
                    icon={Zap}
                    tone="energy"
                    helpText={`Wymagane: ${task.energyCost}`}
                  />
                </div>

                <form action={startUniversityTaskAction} className="mt-5">
                  <input type="hidden" name="taskId" value={task.id} />
                  <SubmitButton
                    pendingLabel="Startowanie..."
                    className="w-full"
                    disabled={disabled}
                  >
                    {disabled
                      ? lockedByActive
                        ? "Masz aktywne zadanie"
                        : lockedByLevel
                          ? "Za niski poziom"
                          : "Za malo energii"
                      : "Rozpocznij zadanie"}
                  </SubmitButton>
                </form>
              </article>
            );
          })}
        </div>

        <section className="game-card p-5">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-black text-ink">Ostatnie wykonane zadania</h2>
          </div>
          {history.length > 0 ? (
            <div className="mt-4 divide-y divide-ink/10">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="grid gap-2 py-3 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-black text-ink">{entry.universityTask.title}</p>
                    <p className="text-sm text-ink/60">
                      XP +{entry.experienceReward}, wiedza +{entry.knowledgeReward}, reputacja +
                      {entry.reputationReward}, gotowka +{entry.moneyReward} zl
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink/55">
                    {entry.completedAt?.toLocaleString("pl-PL") ?? "Zakonczone"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-ink/65">
              Historia jest jeszcze pusta. Dziekanat nie zapomnial, po prostu nic nie ma w aktach.
            </p>
          )}
        </section>

        <section className="game-card p-5">
          <h2 className="text-2xl font-black text-ink">Dziennik nagrod i statystyk</h2>
          <RewardLogList studentId={student.id} />
        </section>
      </section>
    </div>
  );
}

function RewardBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white/80 px-4 py-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-ink/45">{label}</p>
        <p className="text-lg font-black text-ink">{value}</p>
      </div>
    </div>
  );
}

async function RewardLogList({ studentId }: { studentId: string }) {
  const logs = await prisma.studentRewardLog.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (logs.length === 0) {
    return <p className="mt-4 text-ink/65">Brak wpisow. System czeka na pierwsze zaliczenie.</p>;
  }

  return (
    <div className="mt-4 divide-y divide-ink/10">
      {logs.map((log) => (
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
  );
}

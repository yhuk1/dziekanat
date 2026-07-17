import Image from "next/image";
import { GraduationCap, ScrollText } from "lucide-react";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import { attemptSemesterExamAction } from "@/features/exams/actions";
import {
  EXAM_STATUS,
  canAttemptExam,
  calculateExamScore,
  getSemesterRequirement,
} from "@/features/exams/rules";
import { aggregateEquipmentBonuses } from "@/features/inventory/rules";
import { syncStudentEnergy } from "@/features/players/server";
import { TASK_STATUS } from "@/features/tasks/rules";
import { prisma } from "@/lib/prisma";

type ExamPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function ExamPage({ searchParams }: ExamPageProps) {
  const { student: sessionStudent } = await requireStudent();
  const student = await syncStudentEnergy(prisma, sessionStudent.id);
  const params = await searchParams;
  const requirement = getSemesterRequirement(student.semester);
  const [completedTasks, lastAttempt, attempts] = await Promise.all([
    prisma.studentTask.count({
      where: { studentId: student.id, status: TASK_STATUS.completed },
    }),
    prisma.studentExamAttempt.findFirst({
      where: { studentId: student.id, semester: student.semester },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentExamAttempt.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  const equipmentBonuses = aggregateEquipmentBonuses(
    student.equippedItems.map((equipment) => equipment.inventoryItem.item),
  );
  const examStudent = {
    semester: student.semester,
    level: student.level,
    knowledge: student.knowledge,
    stress: student.stress,
    studyProgramSlug: student.studyProgram.slug,
  };
  const projectedScore = calculateExamScore(examStudent, equipmentBonuses);
  const attemptCheck = canAttemptExam(examStudent, completedTasks, lastAttempt, new Date());
  const latestAttempt = attempts[0];
  const latestAttemptImage =
    latestAttempt?.status === EXAM_STATUS.passed
      ? "/images/exams/exam-success.webp"
      : latestAttempt?.status === EXAM_STATUS.failed
        ? "/images/exams/exam-failure.webp"
        : null;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="game-card-dark relative overflow-hidden p-5 md:p-7">
          <Image
            src="/images/exams/exam-boss.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="object-cover object-[center_30%] md:object-[center_42%]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/82 via-ink/64 to-ink/90 md:bg-gradient-to-r md:from-ink/90 md:via-ink/70 md:to-ink/30" />
          <div className="relative z-10 min-h-[300px] content-end">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-200">Egzamin</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Egzamin konczacy semestr {student.semester}
            </h1>
            <p className="mt-3 max-w-3xl text-white/78">
              Wynik liczy serwer z wiedzy, poziomu, stresu, bonusu kierunku i aktywnego ekwipunku.
              Klient moze najwyzej nerwowo odswiezyc strone.
            </p>
          </div>
        </div>

        <StatusMessage error={params.error} success={params.success} />

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-2xl font-black text-ink">Wymagania</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <Requirement
                label="Poziom"
                current={student.level}
                required={requirement.requiredLevel}
              />
              <Requirement
                label="Wiedza"
                current={student.knowledge}
                required={requirement.requiredKnowledge}
              />
              <Requirement
                label="Zadania uczelni"
                current={completedTasks}
                required={requirement.requiredCompletedTasks}
              />
              <Requirement
                label="Wynik prognozowany"
                current={projectedScore}
                required={requirement.requiredScore}
              />
            </div>
            {lastAttempt?.status === EXAM_STATUS.failed && lastAttempt.nextAttemptAllowedAt ? (
              <p className="mt-4 rounded-md bg-warning/10 px-4 py-3 text-sm font-bold text-warning">
                Kolejna proba po: {lastAttempt.nextAttemptAllowedAt.toLocaleString("pl-PL")}
              </p>
            ) : null}
            <form action={attemptSemesterExamAction} className="mt-5">
              <SubmitButton disabled={!attemptCheck.ok} pendingLabel="Egzamin trwa...">
                Podejdz do egzaminu
              </SubmitButton>
            </form>
            {!attemptCheck.ok ? (
              <p className="mt-3 text-sm font-semibold text-warning">{attemptCheck.message}</p>
            ) : null}
          </section>

          <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
            <div className="flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-2xl font-black text-ink">Ostatni przebieg</h2>
            </div>
            {latestAttempt ? (
              <div className="mt-4 rounded-md bg-paper p-4">
                {latestAttemptImage ? (
                  <div className="relative mb-4 aspect-[3/2] overflow-hidden rounded-md border border-ink/10 bg-white">
                    <Image
                      src={latestAttemptImage}
                      alt={
                        latestAttempt.status === EXAM_STATUS.passed
                          ? "Ilustracja zdanego egzaminu"
                          : "Ilustracja nieudanego podejscia do egzaminu"
                      }
                      fill
                      sizes="(min-width: 1024px) 620px, 100vw"
                      className="object-cover object-[center_38%] md:object-center"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" />
                  </div>
                ) : null}
                <p className="font-black text-ink">
                  Semestr {latestAttempt.semester}:{" "}
                  {latestAttempt.status === EXAM_STATUS.passed ? "zaliczone" : "niezaliczone"}
                </p>
                <p className="mt-1 text-sm font-bold text-ink/55">
                  Wynik {latestAttempt.score}/{latestAttempt.requiredScore}
                </p>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-ink/70">
                  {latestAttempt.narrative}
                </pre>
              </div>
            ) : (
              <p className="mt-4 text-ink/65">Brak prob. Komisja jeszcze nie zdazyla Cie poznac.</p>
            )}
          </section>
        </div>

        <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
          <h2 className="text-2xl font-black text-ink">Historia prob</h2>
          {attempts.length > 0 ? (
            <div className="mt-4 divide-y divide-ink/10">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="grid gap-2 py-3 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-black text-ink">
                      Semestr {attempt.semester} -{" "}
                      {attempt.status === EXAM_STATUS.passed ? "zdany" : "niezdany"}
                    </p>
                    <p className="text-sm text-ink/60">
                      Wiedza {attempt.knowledgeAtAttempt}, poziom {attempt.levelAtAttempt}, stres{" "}
                      {attempt.stressAtAttempt}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink/55">
                    {attempt.createdAt.toLocaleString("pl-PL")} | {attempt.score}/
                    {attempt.requiredScore}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-ink/65">Historia jest pusta.</p>
          )}
        </section>
      </section>
    </div>
  );
}

function Requirement({
  label,
  current,
  required,
}: {
  label: string;
  current: number;
  required: number;
}) {
  const met = current >= required;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-paper px-4 py-3">
      <span className="font-bold text-ink/70">{label}</span>
      <span className={met ? "font-black text-success" : "font-black text-warning"}>
        {current} / {required}
      </span>
    </div>
  );
}

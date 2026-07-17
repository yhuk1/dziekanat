import { redirect } from "next/navigation";
import Image from "next/image";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireUser } from "@/features/auth/session";
import { createStudentAction } from "@/features/players/actions";
import { getStudyProgramImage } from "@/lib/game-assets";
import { prisma } from "@/lib/prisma";

type CreateStudentPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CreateStudentPage({ searchParams }: CreateStudentPageProps) {
  const user = await requireUser();

  if (user.student) {
    redirect("/dashboard");
  }

  const [params, studyPrograms] = await Promise.all([
    searchParams,
    prisma.studyProgram.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="game-card-dark p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-white/50">
            Immatrykulacja
          </p>
          <h1 className="mt-2 text-3xl font-black">Stworz studenta</h1>
          <p className="mt-4 leading-7 text-white/72">
            Wybierz imie i kierunek. Jedno konto moze miec tylko jedna postac, wiec niech to bedzie
            ktos, kto przetrwa kolejke po podpis.
          </p>
          <div className="mt-6 rounded-md bg-white/8 p-4">
            <p className="text-sm font-bold text-white/55">Startowe parametry</p>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Poziom 1, wiedza 10, energia 100/100, stres 0, reputacja 0, gotowka 100 zl, semestr 1.
            </p>
          </div>
        </div>

        <form action={createStudentAction} className="game-card p-6">
          <FormError message={params.error} />

          <label className="mt-4 block">
            <span className="text-sm font-bold text-ink/70">Imie postaci</span>
            <input
              required
              name="displayName"
              minLength={2}
              maxLength={40}
              className="game-input"
              placeholder="Np. Ada od Poprawek"
            />
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-bold text-ink/70">Kierunek studiow</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {studyPrograms.map((program) => (
                <label
                  key={program.id}
                  className="cursor-pointer rounded-lg border border-ink/10 bg-paper p-4 transition hover:border-accent hover:bg-white has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                >
                  <input
                    required
                    type="radio"
                    name="studyProgramId"
                    value={program.id}
                    className="peer sr-only"
                  />
                  {getStudyProgramImage(program.slug) ? (
                    <span className="relative mb-4 block aspect-[4/5] overflow-hidden rounded-md bg-white shadow-sm">
                      <Image
                        src={getStudyProgramImage(program.slug)}
                        alt={`Ilustracja kierunku ${program.name}`}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                        className="object-cover object-top"
                      />
                    </span>
                  ) : null}
                  <span className="block text-lg font-black text-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent">
                    {program.name}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-ink/65">
                    {program.description}
                  </span>
                  <span className="mt-3 block text-xs font-bold uppercase tracking-widest text-accent">
                    {program.bonusLabel}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <SubmitButton pendingLabel="Tworzenie postaci..." className="mt-6">
            Zapisz postac
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}

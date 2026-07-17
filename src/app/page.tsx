import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/features/auth/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user?.student) {
    redirect("/dashboard");
  }

  if (user) {
    redirect("/student/create");
  }

  return (
    <div className="overflow-x-clip px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="game-card-dark relative min-h-[680px] overflow-hidden p-6 md:min-h-[640px] md:p-10">
          <Image
            src="/images/backgrounds/hero-home-mobile.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_28%] md:hidden"
            aria-hidden="true"
          />
          <Image
            src="/images/backgrounds/hero-home.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="hidden object-cover object-[center_42%] md:block lg:object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/72 via-ink/50 to-ink/90 md:bg-gradient-to-r md:from-ink/90 md:via-ink/62 md:to-ink/18" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

          <div className="relative z-10 flex min-h-[620px] max-w-3xl flex-col justify-end md:min-h-[560px]">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/18 bg-white/12 px-3 py-2 text-sm font-black text-white backdrop-blur">
              <GraduationCap className="h-4 w-4 text-amber-200" aria-hidden="true" />
              Semestr startowy
            </div>
            <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-6xl">
              Dziekanat: Gra o Zaliczenie
            </h1>
            <p className="mt-5 text-lg font-bold leading-8 text-white/88">
              Przetrwaj semestr. Zdobadz zaliczenie. Pokonaj dziekanat.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
              Stworz studenta, wybierz kierunek i zacznij akademicka przygode, w ktorej energia,
              stres i reputacja maja znaczenie wieksze niz wolny termin w dziekanacie.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-ink shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink"
              >
                Zaloz konto
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 bg-white/12 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-ink focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink"
              >
                Mam juz indeks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

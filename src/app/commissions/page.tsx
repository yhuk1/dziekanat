import Link from "next/link";
import { ClipboardList, Coins } from "lucide-react";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import { acceptCommissionAction, syncOverdueCommissions } from "@/features/commissions/actions";
import { COMMISSION_STATUS } from "@/features/commissions/rules";
import { getCommissionStatusLabel } from "@/features/commissions/status";
import { prisma } from "@/lib/prisma";

type CommissionsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function CommissionsPage({ searchParams }: CommissionsPageProps) {
  const { student } = await requireStudent();
  const params = await searchParams;
  await syncOverdueCommissions();

  const commissions = await prisma.studentCommission.findMany({
    where: {
      status: COMMISSION_STATUS.open,
      creatorId: { not: student.id },
      minimumLevel: { lte: student.level },
    },
    include: { creator: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <Header
          title="Tablica zlecen"
          description="Studenci prosza studentow. Depozyt trzyma baza, nie dobra wola."
        />
        <StatusMessage error={params.error} success={params.success} />
        <div className="flex flex-wrap gap-2">
          <NavLink href="/commissions/new" label="Wystaw zlecenie" />
          <NavLink href="/commissions/created" label="Moje wystawione" />
          <NavLink href="/commissions/accepted" label="Moje przyjete" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {commissions.map((commission) => (
            <article
              key={commission.id}
              className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-paper px-3 py-1 text-xs font-black uppercase tracking-widest text-accent">
                  {commission.category}
                </span>
                <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                  {getCommissionStatusLabel(commission.status)}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-black text-ink">{commission.title}</h2>
              <p className="mt-2 line-clamp-4 leading-7 text-ink/70">{commission.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span className="rounded-md bg-paper px-3 py-2 font-bold">
                  lvl {commission.minimumLevel}
                </span>
                <span className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 font-bold">
                  <Coins className="h-4 w-4 text-accent" aria-hidden="true" />
                  {commission.moneyReward} zl
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-ink/55">
                Termin: {commission.deadlineAt.toLocaleString("pl-PL")}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={`/commissions/${commission.id}`}
                  className="rounded-md border border-ink/15 px-4 py-2 text-center text-sm font-black text-ink hover:border-accent hover:text-accent"
                >
                  Szczegoly
                </Link>
                <form action={acceptCommissionAction}>
                  <input type="hidden" name="commissionId" value={commission.id} />
                  <SubmitButton className="w-full" pendingLabel="Przyjmowanie...">
                    Przyjmij
                  </SubmitButton>
                </form>
              </div>
            </article>
          ))}
        </div>
        {commissions.length === 0 ? <EmptyBoard /> : null}
      </section>
    </div>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel md:p-7">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">Zlecenia studentow</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-ink/70">{description}</p>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white hover:bg-accent"
    >
      {label}
    </Link>
  );
}

function EmptyBoard() {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-white/70 p-6 text-ink/70">
      <ClipboardList className="h-8 w-8 text-accent" aria-hidden="true" />
      <p className="mt-3 font-bold">
        Brak dostepnych zlecen. Kampus chwilowo udaje samowystarczalny.
      </p>
    </div>
  );
}

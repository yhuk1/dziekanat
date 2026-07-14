import Link from "next/link";
import { StatusMessage } from "@/components/ui/status-message";
import { requireStudent } from "@/features/auth/session";
import { syncOverdueCommissions } from "@/features/commissions/actions";
import { CommissionCard } from "@/features/commissions/commission-card";
import { prisma } from "@/lib/prisma";

type CreatedCommissionsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function CreatedCommissionsPage({
  searchParams,
}: CreatedCommissionsPageProps) {
  const { student } = await requireStudent();
  const params = await searchParams;
  await syncOverdueCommissions();

  const commissions = await prisma.studentCommission.findMany({
    where: { creatorId: student.id },
    include: { contractor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <Header title="Moje wystawione zlecenia" />
        <StatusMessage error={params.error} success={params.success} />
        <Link
          href="/commissions/new"
          className="inline-flex rounded-md bg-ink px-4 py-2 text-sm font-black text-white hover:bg-accent"
        >
          Wystaw nowe zlecenie
        </Link>
        <div className="grid gap-4 lg:grid-cols-3">
          {commissions.map((commission) => (
            <CommissionCard key={commission.id} commission={commission} mode="created" />
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel md:p-7">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">Historia zlecen</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{title}</h1>
    </div>
  );
}

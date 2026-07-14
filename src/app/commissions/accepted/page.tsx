import { StatusMessage } from "@/components/ui/status-message";
import { requireStudent } from "@/features/auth/session";
import { syncOverdueCommissions } from "@/features/commissions/actions";
import { CommissionCard } from "@/features/commissions/commission-card";
import { prisma } from "@/lib/prisma";

type AcceptedCommissionsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function AcceptedCommissionsPage({
  searchParams,
}: AcceptedCommissionsPageProps) {
  const { student } = await requireStudent();
  const params = await searchParams;
  await syncOverdueCommissions();

  const commissions = await prisma.studentCommission.findMany({
    where: { contractorId: student.id },
    include: { creator: true },
    orderBy: { acceptedAt: "desc" },
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel md:p-7">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Moja robota</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Moje przyjete zlecenia</h1>
        </div>
        <StatusMessage error={params.error} success={params.success} />
        <div className="grid gap-4 lg:grid-cols-3">
          {commissions.map((commission) => (
            <CommissionCard key={commission.id} commission={commission} mode="accepted" />
          ))}
        </div>
      </section>
    </div>
  );
}

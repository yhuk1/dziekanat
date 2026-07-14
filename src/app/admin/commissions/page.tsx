import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { cancelCommissionAdminAction } from "@/features/admin/actions";
import { AdminShell } from "@/features/admin/components";
import { requireAdmin } from "@/features/auth/session";
import { COMMISSION_STATUS } from "@/features/commissions/rules";
import { getCommissionStatusLabel } from "@/features/commissions/status";
import { prisma } from "@/lib/prisma";

type AdminCommissionsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function AdminCommissionsPage({ searchParams }: AdminCommissionsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const commissions = await prisma.studentCommission.findMany({
    include: {
      creator: { select: { displayName: true } },
      contractor: { select: { displayName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AdminShell
      title="Zgloszone zlecenia"
      description="Podglad rynku miedzy studentami i awaryjne anulowanie, gdy sytuacja pachnie protokolem."
    >
      <StatusMessage error={params.error} success={params.success} />
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">Ostatnie zlecenia</h2>
        <div className="mt-4 divide-y divide-ink/10">
          {commissions.map((commission) => {
            const canCancel =
              commission.status !== COMMISSION_STATUS.approved &&
              commission.status !== COMMISSION_STATUS.cancelled;

            return (
              <div key={commission.id} className="grid gap-3 py-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-paper px-2 py-1 text-xs font-black uppercase tracking-widest text-accent">
                      {commission.category}
                    </span>
                    <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                      {getCommissionStatusLabel(commission.status)}
                    </span>
                    <span className="rounded-md bg-paper px-2 py-1 text-xs font-black text-ink/65">
                      {commission.moneyReward} zl depozytu
                    </span>
                  </div>
                  <p className="mt-2 font-black text-ink">{commission.title}</p>
                  <p className="text-sm text-ink/65">{commission.description}</p>
                  <p className="mt-2 text-sm font-bold text-ink/55">
                    Wystawia: {commission.creator.displayName}; wykonawca:{" "}
                    {commission.contractor?.displayName ?? "brak"}; termin:{" "}
                    {commission.deadlineAt.toLocaleString("pl-PL")}
                  </p>
                </div>
                {canCancel ? (
                  <form action={cancelCommissionAdminAction}>
                    <input type="hidden" name="commissionId" value={commission.id} />
                    <SubmitButton pendingLabel="Anulowanie..." className="bg-warning hover:bg-ink">
                      Anuluj awaryjnie
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}

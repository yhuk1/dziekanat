import { notFound } from "next/navigation";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import {
  acceptCommissionAction,
  approveCommissionAction,
  cancelCommissionAction,
  submitCommissionAction,
  syncOverdueCommissions,
} from "@/features/commissions/actions";
import { COMMISSION_STATUS } from "@/features/commissions/rules";
import { getCommissionStatusLabel } from "@/features/commissions/status";
import { prisma } from "@/lib/prisma";

type CommissionDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function CommissionDetailsPage({
  params,
  searchParams,
}: CommissionDetailsPageProps) {
  const { student } = await requireStudent();
  const [{ id }, messages] = await Promise.all([params, searchParams]);
  await syncOverdueCommissions();

  const commission = await prisma.studentCommission.findUnique({
    where: { id },
    include: { creator: true, contractor: true },
  });

  if (!commission) {
    notFound();
  }

  const isCreator = commission.creatorId === student.id;
  const isContractor = commission.contractorId === student.id;
  const canAccept =
    commission.status === COMMISSION_STATUS.open &&
    !isCreator &&
    student.level >= commission.minimumLevel &&
    commission.deadlineAt > new Date();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-5">
        <StatusMessage error={messages.error} success={messages.success} />
        <article className="rounded-lg border border-ink/10 bg-white/78 p-6 shadow-panel">
          <p className="text-sm font-black uppercase tracking-widest text-accent">
            {commission.category}
          </p>
          <h1 className="mt-2 text-3xl font-black text-ink">{commission.title}</h1>
          <p className="mt-4 leading-7 text-ink/75">{commission.description}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info label="Status" value={getCommissionStatusLabel(commission.status)} />
            <Info label="Nagroda" value={`${commission.moneyReward} zl`} />
            <Info label="Minimalny poziom" value={String(commission.minimumLevel)} />
            <Info label="Termin" value={commission.deadlineAt.toLocaleString("pl-PL")} />
            <Info label="Wystawia" value={commission.creator.displayName} />
            <Info label="Wykonawca" value={commission.contractor?.displayName ?? "Brak"} />
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {canAccept ? (
              <form action={acceptCommissionAction}>
                <input type="hidden" name="commissionId" value={commission.id} />
                <SubmitButton pendingLabel="Przyjmowanie...">Przyjmij</SubmitButton>
              </form>
            ) : null}
            {isCreator && commission.status === COMMISSION_STATUS.open ? (
              <form action={cancelCommissionAction}>
                <input type="hidden" name="commissionId" value={commission.id} />
                <SubmitButton className="bg-warning hover:bg-ink" pendingLabel="Anulowanie...">
                  Anuluj
                </SubmitButton>
              </form>
            ) : null}
            {isContractor && commission.status === COMMISSION_STATUS.accepted ? (
              <form action={submitCommissionAction}>
                <input type="hidden" name="commissionId" value={commission.id} />
                <SubmitButton pendingLabel="Oznaczanie...">Oznacz jako wykonane</SubmitButton>
              </form>
            ) : null}
            {isCreator && commission.status === COMMISSION_STATUS.submitted ? (
              <form action={approveCommissionAction}>
                <input type="hidden" name="commissionId" value={commission.id} />
                <SubmitButton className="bg-success hover:bg-ink" pendingLabel="Zatwierdzanie...">
                  Zatwierdz i wyplac
                </SubmitButton>
              </form>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-paper px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-widest text-ink/50">{label}</p>
      <p className="mt-1 font-black text-ink">{value}</p>
    </div>
  );
}

import Link from "next/link";
import { Coins } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { approveCommissionAction, cancelCommissionAction, submitCommissionAction } from "./actions";
import { COMMISSION_STATUS } from "./rules";
import { getCommissionStatusLabel } from "./status";

type CommissionCardProps = {
  commission: {
    id: string;
    title: string;
    description: string;
    category: string;
    minimumLevel: number;
    moneyReward: number;
    status: string;
    deadlineAt: Date;
    creator?: { displayName: string } | null;
    contractor?: { displayName: string } | null;
  };
  mode: "created" | "accepted";
};

export function CommissionCard({ commission, mode }: CommissionCardProps) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-paper px-3 py-1 text-xs font-black uppercase tracking-widest text-accent">
          {commission.category}
        </span>
        <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
          {getCommissionStatusLabel(commission.status)}
        </span>
      </div>
      <h2 className="mt-4 text-xl font-black text-ink">{commission.title}</h2>
      <p className="mt-2 line-clamp-3 text-ink/70">{commission.description}</p>
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
      {commission.creator ? (
        <p className="mt-2 text-sm text-ink/55">Wystawia: {commission.creator.displayName}</p>
      ) : null}
      {commission.contractor ? (
        <p className="mt-2 text-sm text-ink/55">Wykonawca: {commission.contractor.displayName}</p>
      ) : null}
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={`/commissions/${commission.id}`}
          className="rounded-md border border-ink/15 px-4 py-2 text-center text-sm font-black text-ink hover:border-accent hover:text-accent"
        >
          Szczegoly
        </Link>
        {mode === "created" && commission.status === COMMISSION_STATUS.open ? (
          <form action={cancelCommissionAction}>
            <input type="hidden" name="commissionId" value={commission.id} />
            <SubmitButton className="w-full bg-warning hover:bg-ink" pendingLabel="Anulowanie...">
              Anuluj i zwroc depozyt
            </SubmitButton>
          </form>
        ) : null}
        {mode === "created" && commission.status === COMMISSION_STATUS.submitted ? (
          <form action={approveCommissionAction}>
            <input type="hidden" name="commissionId" value={commission.id} />
            <SubmitButton
              className="w-full bg-success hover:bg-ink"
              pendingLabel="Zatwierdzanie..."
            >
              Zatwierdz wykonanie
            </SubmitButton>
          </form>
        ) : null}
        {mode === "accepted" && commission.status === COMMISSION_STATUS.accepted ? (
          <form action={submitCommissionAction}>
            <input type="hidden" name="commissionId" value={commission.id} />
            <SubmitButton className="w-full" pendingLabel="Oznaczanie...">
              Oznacz jako wykonane
            </SubmitButton>
          </form>
        ) : null}
      </div>
    </article>
  );
}

import { AlertTriangle, CheckCircle2 } from "lucide-react";

type StatusMessageProps = {
  error?: string;
  success?: string;
};

export function StatusMessage({ error, success }: StatusMessageProps) {
  const message = error ?? success;

  if (!message) {
    return null;
  }

  const isError = Boolean(error);
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <div
      className={
        isError
          ? "flex items-start gap-3 rounded-lg border border-warning/35 bg-warning/10 px-4 py-3 text-sm font-bold text-warning shadow-sm"
          : "flex items-start gap-3 rounded-lg border border-success/35 bg-success/10 px-4 py-3 text-sm font-bold text-success shadow-sm"
      }
      role={isError ? "alert" : "status"}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-warning/35 bg-warning/10 px-4 py-3 text-sm font-bold text-warning"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

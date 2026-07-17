"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({
  children,
  pendingLabel = "Przetwarzanie...",
  className,
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-black text-white shadow-lg shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-65",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type StatCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "default" | "light";
};

export function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition hover:-translate-y-0.5",
        light
          ? "border-white/10 bg-white/8 text-white"
          : "border-ink/10 bg-white/80 text-ink shadow-panel",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm font-bold", light ? "text-white/58" : "text-ink/55")}>{label}</p>
        {Icon ? (
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md",
              light ? "bg-white/10 text-white" : "bg-accent/10 text-accent",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

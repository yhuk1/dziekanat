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
        "rounded-lg border p-4",
        light
          ? "border-white/10 bg-white/8 text-white"
          : "border-ink/10 bg-white/78 text-ink shadow-panel",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm font-bold", light ? "text-white/58" : "text-ink/55")}>{label}</p>
        {Icon ? (
          <Icon
            className={cn("h-4 w-4", light ? "text-white/50" : "text-accent")}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

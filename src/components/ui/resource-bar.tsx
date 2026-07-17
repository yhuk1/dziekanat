import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProgressBar } from "./progress-bar";

type ResourceTone = "energy" | "stress" | "experience" | "money";

type ResourceBarProps = {
  label: string;
  value: number;
  max: number;
  icon?: LucideIcon;
  tone?: ResourceTone;
  helpText?: string;
};

const toneClasses: Record<ResourceTone, string> = {
  energy: "from-success to-accent",
  stress: "from-warning to-red-700",
  experience: "from-accent to-ink",
  money: "from-yellow-600 to-success",
};

export function ResourceBar({
  label,
  value,
  max,
  icon: Icon,
  tone = "experience",
  helpText,
}: ResourceBarProps) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-5 w-5 text-accent" aria-hidden="true" /> : null}
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-ink/55">{label}</p>
            {helpText ? <p className="mt-1 text-xs font-semibold text-ink/55">{helpText}</p> : null}
          </div>
        </div>
        <p className="shrink-0 rounded-md bg-paper px-2 py-1 text-sm font-black text-ink">
          {value} / {max}
        </p>
      </div>
      <ProgressBar
        value={value}
        max={max}
        label={label}
        className="mt-3 h-4"
        indicatorClassName={cn("bg-gradient-to-r", toneClasses[tone])}
      />
    </div>
  );
}

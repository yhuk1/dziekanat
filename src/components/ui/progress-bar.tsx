import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-ink/12", className)}>
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}

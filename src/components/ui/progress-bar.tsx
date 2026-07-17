import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  indicatorClassName?: string;
  label?: string;
};

export function ProgressBar({
  value,
  max,
  className,
  indicatorClassName,
  label,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className={cn(
        "h-3 overflow-hidden rounded-full border border-ink/10 bg-ink/10 shadow-inner",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-accent transition-all", indicatorClassName)}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}

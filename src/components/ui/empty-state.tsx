import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-ink/25 bg-white/80 p-6 shadow-panel">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-warning/12 text-warning">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/70">{description}</p>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white/72 p-5 shadow-panel">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
      <p className="mt-2 leading-7 text-ink/70">{description}</p>
    </article>
  );
}

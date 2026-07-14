import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import { createCommissionAction } from "@/features/commissions/actions";
import { COMMISSION_CATEGORIES } from "@/features/commissions/rules";

type NewCommissionPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function NewCommissionPage({ searchParams }: NewCommissionPageProps) {
  await requireStudent();
  const params = await searchParams;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-ink/10 bg-white/78 p-6 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Nowe zlecenie</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Wystaw zlecenie studentom</h1>
        <p className="mt-3 text-ink/70">
          Nagroda zostanie od razu pobrana jako depozyt. Baza pilnuje monet, nie kolega z grupy.
        </p>
        <form action={createCommissionAction} className="mt-6 space-y-4">
          <StatusMessage error={params.error} success={params.success} />
          <Input name="title" label="Tytul" placeholder="Potrzebuje notatek z ostatniego wykladu" />
          <label className="block">
            <span className="text-sm font-bold text-ink/70">Opis</span>
            <textarea
              name="description"
              required
              rows={5}
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink/70">Kategoria</span>
              <select
                name="category"
                className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3"
              >
                {COMMISSION_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <Input name="minimumLevel" label="Minimalny poziom" type="number" defaultValue="1" />
            <Input name="deadlineAt" label="Termin" type="datetime-local" />
            <Input name="moneyReward" label="Nagroda pieniezna" type="number" defaultValue="20" />
          </div>
          <SubmitButton pendingLabel="Publikowanie...">Opublikuj zlecenie</SubmitButton>
        </form>
      </section>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <input
        name={name}
        required
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

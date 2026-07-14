import type { ItemDefinition } from "@prisma/client";
import Link from "next/link";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveItemDefinitionAdminAction } from "@/features/admin/actions";
import { AdminShell, CheckboxField, Field } from "@/features/admin/components";
import { requireAdmin } from "@/features/auth/session";
import { describeItemBonuses } from "@/features/inventory/rules";
import { prisma } from "@/lib/prisma";

type AdminItemsPageProps = {
  searchParams: Promise<{ edit?: string; error?: string; success?: string }>;
};

export default async function AdminItemsPage({ searchParams }: AdminItemsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const [items, editedItem] = await Promise.all([
    prisma.itemDefinition.findMany({
      orderBy: [{ isActive: "desc" }, { category: "asc" }, { name: "asc" }],
      take: 100,
    }),
    params.edit ? prisma.itemDefinition.findUnique({ where: { id: params.edit } }) : null,
  ]);

  return (
    <AdminShell
      title="Definicje przedmiotow"
      description="Tu powstaja rzeczy, ktore pozniej dziwnie szybko trafiaja do plecakow studentow."
    >
      <StatusMessage error={params.error} success={params.success} />
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">
          {editedItem ? "Edytuj przedmiot" : "Nowy przedmiot"}
        </h2>
        <ItemForm item={editedItem} />
      </section>
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">Lista przedmiotow</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-ink/10 bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-black text-ink">{item.name}</p>
                  <p className="text-sm text-ink/60">
                    {item.category} · {item.rarity} · {item.isActive ? "aktywne" : "wylaczone"}
                  </p>
                </div>
                <Link
                  href={`/admin/items?edit=${item.id}`}
                  className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white hover:bg-accent"
                >
                  Edytuj
                </Link>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{item.description}</p>
              <p className="mt-2 text-sm font-bold text-ink/55">{describeItemBonuses(item)}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function ItemForm({ item }: { item: ItemDefinition | null }) {
  return (
    <form action={saveItemDefinitionAdminAction} className="mt-4 grid gap-4 lg:grid-cols-2">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <Field label="Slug techniczny" name="slug" defaultValue={item?.slug} />
      <Field label="Nazwa" name="name" defaultValue={item?.name} />
      <Field label="Opis" name="description" defaultValue={item?.description} textarea />
      <Field label="Kategoria" name="category" defaultValue={item?.category ?? "Akcesorium"} />
      <Field label="Slot" name="slot" defaultValue={item?.slot} />
      <Field label="Rzadkosc" name="rarity" defaultValue={item?.rarity ?? "Pospolity"} />
      <Field
        label="Bonus wiedzy"
        name="knowledgeBonus"
        type="number"
        defaultValue={item?.knowledgeBonus ?? 0}
      />
      <Field
        label="Bonus maks. energii"
        name="maximumEnergyBonus"
        type="number"
        defaultValue={item?.maximumEnergyBonus ?? 0}
      />
      <Field
        label="Bonus regeneracji %"
        name="energyRegenBonus"
        type="number"
        defaultValue={item?.energyRegenBonus ?? 0}
      />
      <Field
        label="Bonus reputacji"
        name="reputationBonus"
        type="number"
        defaultValue={item?.reputationBonus ?? 0}
      />
      <Field
        label="Bonus nagrod pienieznych %"
        name="moneyRewardBonus"
        type="number"
        defaultValue={item?.moneyRewardBonus ?? 0}
      />
      <Field
        label="Skrocenie czasu %"
        name="taskTimeBonus"
        type="number"
        defaultValue={item?.taskTimeBonus ?? 0}
      />
      <Field
        label="Kategoria zadan dla czasu"
        name="taskCategory"
        defaultValue={item?.taskCategory}
      />
      <Field
        label="Odnawia energie"
        name="energyRestore"
        type="number"
        defaultValue={item?.energyRestore ?? 0}
      />
      <Field
        label="Zmniejsza stres"
        name="stressReduce"
        type="number"
        defaultValue={item?.stressReduce ?? 0}
      />
      <div className="flex flex-wrap items-end gap-3">
        <CheckboxField
          label="Jednorazowy"
          name="isConsumable"
          defaultChecked={item?.isConsumable ?? false}
        />
        <CheckboxField label="Aktywny" name="isActive" defaultChecked={item?.isActive ?? true} />
        <SubmitButton pendingLabel="Zapisywanie...">Zapisz przedmiot</SubmitButton>
      </div>
    </form>
  );
}

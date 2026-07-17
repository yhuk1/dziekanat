import Image from "next/image";
import { Backpack, BatteryCharging, PackageCheck, Sparkles } from "lucide-react";
import { ResourceBar } from "@/components/ui/resource-bar";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import {
  equipInventoryItemAction,
  unequipInventoryItemAction,
  useConsumableItemAction,
} from "@/features/inventory/actions";
import { aggregateEquipmentBonuses, describeItemBonuses } from "@/features/inventory/rules";
import { syncStudentEnergy } from "@/features/players/server";
import { getItemImage } from "@/lib/game-assets";
import { prisma } from "@/lib/prisma";

type InventoryPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const { student: sessionStudent } = await requireStudent();
  const student = await syncStudentEnergy(prisma, sessionStudent.id);
  const params = await searchParams;

  const [inventoryItems, equipment] = await Promise.all([
    prisma.studentInventoryItem.findMany({
      where: { studentId: student.id },
      include: { item: true, equipment: true },
      orderBy: [{ item: { category: "asc" } }, { item: { name: "asc" } }],
    }),
    prisma.studentEquipment.findMany({
      where: { studentId: student.id },
      include: {
        inventoryItem: {
          include: { item: true },
        },
      },
      orderBy: { slot: "asc" },
    }),
  ]);

  const equippedItemIds = new Set(equipment.map((entry) => entry.inventoryItemId));
  const equipmentBonuses = aggregateEquipmentBonuses(
    equipment.map((entry) => entry.inventoryItem.item),
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="game-card overflow-hidden p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">Ekwipunek</p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Plecak, kieszenie i rzeczy o niejasnym pochodzeniu
              </h1>
              <p className="mt-3 max-w-3xl text-ink/70">
                Bonusy liczy serwer na podstawie przedmiotow w bazie. Klient moze klikac, ale nie
                negocjuje statystyk z dziekanatem.
              </p>
            </div>
            <ResourceBar
              label="Energia"
              value={student.energy}
              max={student.maximumEnergy + equipmentBonuses.maximumEnergyBonus}
              icon={BatteryCharging}
              tone="energy"
              helpText="Limit po bonusach"
            />
          </div>
          <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-lg border border-ink/10 bg-paper max-sm:aspect-[4/3]">
            <Image
              src="/images/items/items-preview.webp"
              alt="Zestaw uczelnianych przedmiotow do ekwipunku"
              fill
              sizes="(min-width: 1280px) 1180px, 100vw"
              className="object-cover object-[center_42%] md:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-ink/38 to-transparent md:bg-gradient-to-r md:from-ink/78 md:via-ink/32 md:to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 max-w-md text-sm font-bold leading-6 text-white drop-shadow">
              Kazdy bonus pochodzi z bazy. Kubek termiczny nadal nie jest dokumentem tozsamosci.
            </p>
          </div>
        </div>

        <StatusMessage error={params.error} success={params.success} />

        <section className="game-card p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-black text-ink">Aktywne bonusy</h2>
          </div>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <BonusPill label={`Wiedza +${equipmentBonuses.knowledgeBonus}`} />
            <BonusPill label={`Maks. energia +${equipmentBonuses.maximumEnergyBonus}`} />
            <BonusPill label={`Regeneracja +${equipmentBonuses.energyRegenBonus}%`} />
            <BonusPill label={`Reputacja +${equipmentBonuses.reputationBonus}`} />
            <BonusPill label={`Pieniadze +${equipmentBonuses.moneyRewardBonus}%`} />
            <BonusPill label={`Czas zadan -${equipmentBonuses.taskTimeBonus}%`} />
          </div>
        </section>

        <section className="game-card p-5">
          <div className="flex items-center gap-3">
            <Backpack className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-black text-ink">Wyposazone przedmioty</h2>
          </div>
          {equipment.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {equipment.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-accent/25 bg-accent/10 p-4 shadow-sm"
                >
                  {getItemImage(entry.inventoryItem.item.slug) ? (
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-white/70">
                      <Image
                        src={getItemImage(entry.inventoryItem.item.slug)}
                        alt={`Wyposazony przedmiot: ${entry.inventoryItem.item.name}`}
                        fill
                        sizes="(min-width: 1024px) 240px, (min-width: 768px) 45vw, 100vw"
                        className="object-contain p-3"
                      />
                    </div>
                  ) : null}
                  <p className="text-xs font-black uppercase tracking-widest text-accent">
                    Slot: {entry.slot}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-ink">
                    {entry.inventoryItem.item.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">
                    {describeItemBonuses(entry.inventoryItem.item)}
                  </p>
                  <form action={unequipInventoryItemAction} className="mt-4">
                    <input type="hidden" name="inventoryItemId" value={entry.inventoryItemId} />
                    <SubmitButton pendingLabel="Zdejmowanie..." className="bg-warning hover:bg-ink">
                      Zdejmij
                    </SubmitButton>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-ink/65">
              Nic nie jest wyposazone. Minimalizm jest elegancki, ale slabo bonusuje.
            </p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {inventoryItems.map((inventoryItem) => {
            const item = inventoryItem.item;
            const isEquipped = equippedItemIds.has(inventoryItem.id);
            const itemImage = getItemImage(item.slug);

            return (
              <article
                key={inventoryItem.id}
                className="game-card flex flex-col p-5 transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="game-chip-accent">{item.category}</span>
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                    {item.rarity}
                  </span>
                </div>
                {itemImage ? (
                  <div className="mt-4 overflow-hidden rounded-lg border border-ink/10 bg-paper">
                    <div className="relative aspect-square">
                      <Image
                        src={itemImage}
                        alt={`Przedmiot: ${item.name}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-lg bg-paper text-accent">
                    <PackageCheck className="h-7 w-7" aria-hidden="true" />
                  </div>
                )}
                <h2 className="mt-4 text-xl font-black text-ink">{item.name}</h2>
                <p className="mt-2 flex-1 leading-7 text-ink/70">{item.description}</p>
                <p className="mt-4 rounded-md bg-paper px-3 py-2 text-sm font-bold text-ink/70">
                  {describeItemBonuses(item)}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink/55">
                  Liczba: {inventoryItem.quantity}
                </p>

                {item.isConsumable ? (
                  <form action={useConsumableItemAction} className="mt-5">
                    <input type="hidden" name="inventoryItemId" value={inventoryItem.id} />
                    <SubmitButton
                      pendingLabel="Uzywanie..."
                      className="w-full bg-success hover:bg-ink"
                    >
                      Uzyj
                    </SubmitButton>
                  </form>
                ) : isEquipped ? (
                  <form action={unequipInventoryItemAction} className="mt-5">
                    <input type="hidden" name="inventoryItemId" value={inventoryItem.id} />
                    <SubmitButton
                      pendingLabel="Zdejmowanie..."
                      className="w-full bg-warning hover:bg-ink"
                    >
                      Zdejmij
                    </SubmitButton>
                  </form>
                ) : (
                  <form action={equipInventoryItemAction} className="mt-5">
                    <input type="hidden" name="inventoryItemId" value={inventoryItem.id} />
                    <SubmitButton pendingLabel="Wyposazanie..." className="w-full">
                      Wyposaz
                    </SubmitButton>
                  </form>
                )}
              </article>
            );
          })}
        </section>
      </section>
    </div>
  );
}

function BonusPill({ label }: { label: string }) {
  return <span className="rounded-md bg-paper px-3 py-2 font-bold text-ink/70">{label}</span>;
}

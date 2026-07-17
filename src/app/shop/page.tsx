import Image from "next/image";
import { Coins, PackageCheck, ShoppingBag } from "lucide-react";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireStudent } from "@/features/auth/session";
import { describeItemBonuses } from "@/features/inventory/rules";
import { syncStudentEnergy } from "@/features/players/server";
import { buyShopItemAction } from "@/features/shop/actions";
import { getItemImage } from "@/lib/game-assets";
import { prisma } from "@/lib/prisma";

type ShopPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const sourceLabels: Record<string, string> = {
  starter: "zestaw startowy",
  task: "zadanie",
  shop: "sklep",
  exam: "egzamin",
  event: "wydarzenie",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { student: sessionStudent } = await requireStudent();
  const student = await syncStudentEnergy(prisma, sessionStudent.id);
  const params = await searchParams;

  const [offers, itemLogs] = await Promise.all([
    prisma.shopOffer.findMany({
      where: { isActive: true, item: { isActive: true } },
      include: { item: true },
      orderBy: [{ price: "asc" }, { item: { name: "asc" } }],
    }),
    prisma.studentItemLog.findMany({
      where: { studentId: student.id },
      include: { item: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="game-card p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Sklep uczelniany
              </p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Zakupy za gotowke, nie za punkty ECTS
              </h1>
              <p className="mt-3 max-w-3xl text-ink/70">
                Ceny pochodza z bazy, a zakup rozlicza serwer. Kasjer patrzy spokojnie, ale
                transakcje liczy atomowo.
              </p>
            </div>
            <div className="rounded-lg border border-accent/25 bg-accent/10 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-accent">Gotowka</p>
              <p className="mt-1 text-3xl font-black text-ink">{student.money} zl</p>
            </div>
          </div>
        </div>

        <StatusMessage error={params.error} success={params.success} />

        <section className="grid gap-4 lg:grid-cols-3">
          {offers.map((offer) => {
            const itemImage = getItemImage(offer.item.slug);
            const cannotAfford = student.money < offer.price;

            return (
              <article key={offer.id} className="game-card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="game-chip-accent">{offer.item.category}</span>
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                    {offer.item.rarity}
                  </span>
                </div>

                {itemImage ? (
                  <div className="mt-4 overflow-hidden rounded-lg border border-ink/10 bg-paper">
                    <div className="relative aspect-square">
                      <Image
                        src={itemImage}
                        alt={`Przedmiot w sklepie: ${offer.item.name}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex h-20 w-20 items-center justify-center rounded-lg bg-paper text-accent">
                    <PackageCheck className="h-9 w-9" aria-hidden="true" />
                  </div>
                )}

                <h2 className="mt-4 text-xl font-black text-ink">{offer.item.name}</h2>
                <p className="mt-2 flex-1 leading-7 text-ink/70">{offer.item.description}</p>
                <p className="mt-4 rounded-md bg-paper px-3 py-2 text-sm font-bold text-ink/70">
                  {describeItemBonuses(offer.item)}
                </p>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-ink/10 bg-white/75 px-4 py-3">
                  <span className="inline-flex items-center gap-2 font-black text-ink">
                    <Coins className="h-4 w-4 text-accent" aria-hidden="true" />
                    {offer.price} zl
                  </span>
                  {offer.item.isConsumable ? (
                    <span className="text-xs font-bold uppercase tracking-widest text-ink/45">
                      Wielokrotny zakup
                    </span>
                  ) : null}
                </div>
                <form action={buyShopItemAction} className="mt-5">
                  <input type="hidden" name="offerId" value={offer.id} />
                  <SubmitButton
                    pendingLabel="Kupowanie..."
                    className="w-full"
                    disabled={cannotAfford}
                  >
                    {cannotAfford ? "Za malo gotowki" : "Kup przedmiot"}
                  </SubmitButton>
                </form>
              </article>
            );
          })}
        </section>

        <section className="game-card p-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-black text-ink">Ostatnio zdobyte przedmioty</h2>
          </div>
          {itemLogs.length > 0 ? (
            <div className="mt-4 divide-y divide-ink/10">
              {itemLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid gap-2 py-3 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-black text-ink">
                      {log.item ? `Zdobyto przedmiot: ${log.item.name}` : log.message}
                    </p>
                    <p className="text-sm text-ink/65">
                      Zrodlo: {sourceLabels[log.source] ?? log.source}. {log.message}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink/55">
                    {log.createdAt.toLocaleString("pl-PL")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-ink/65">
              Brak wpisow. Plecak jeszcze brzmi jak pusta obietnica organizacji.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

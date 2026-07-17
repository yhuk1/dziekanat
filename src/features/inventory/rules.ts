import { clampStress } from "../players/energy.ts";

export const ITEM_CATEGORIES = [
  "Laptop",
  "Telefon",
  "Plecak",
  "Podręcznik",
  "Notatki",
  "Strój",
  "Akcesorium",
  "Przedmiot jednorazowy",
] as const;

export type ItemDefinitionSnapshot = {
  slot: string | null;
  isConsumable: boolean;
  knowledgeBonus: number;
  maximumEnergyBonus: number;
  energyRegenBonus: number;
  reputationBonus: number;
  moneyRewardBonus: number;
  taskTimeBonus: number;
  taskCategory: string | null;
  energyRestore: number;
  stressReduce: number;
};

export type InventoryItemSnapshot = {
  id: string;
  studentId: string;
  quantity: number;
  item: ItemDefinitionSnapshot;
};

export type EquipmentSnapshot = {
  slot: string;
  inventoryItemId: string;
};

export const ITEM_SOURCE = {
  starter: "starter",
  task: "task",
  shop: "shop",
  exam: "exam",
  event: "event",
} as const;

export type ItemSource = (typeof ITEM_SOURCE)[keyof typeof ITEM_SOURCE];

const baseStarterItemSlugs = ["freshman-backpack", "library-card", "vending-machine-coffee"];

const starterItemByStudyProgram: Record<string, string> = {
  "computer-science": "old-cousin-laptop",
  management: "organizer-calendar",
  law: "basic-law-code",
  medicine: "anatomy-textbook",
  "graphic-design": "freshman-sketchbook",
};

export function getStarterItemSlugs(studyProgramSlug: string) {
  const programItem = starterItemByStudyProgram[studyProgramSlug];
  return programItem ? [...baseStarterItemSlugs, programItem] : baseStarterItemSlugs;
}

export function canGrantStarterItems(student: { starterItemsGranted: boolean }) {
  if (student.starterItemsGranted) {
    return {
      ok: false,
      message: "Zestaw startowy zostal juz odebrany. Dziekanat nie wydaje duplikatow.",
    };
  }

  return { ok: true };
}

export function canEquipInventoryItem(
  inventoryItem: InventoryItemSnapshot,
  existingEquipment: EquipmentSnapshot[],
) {
  if (inventoryItem.quantity <= 0) {
    return { ok: false, message: "Nie masz juz tego przedmiotu w ekwipunku." };
  }

  if (inventoryItem.item.isConsumable || !inventoryItem.item.slot) {
    return { ok: false, message: "Tego przedmiotu nie da sie wyposazyc." };
  }

  const occupiedSlot = existingEquipment.find(
    (equipment) =>
      equipment.slot === inventoryItem.item.slot && equipment.inventoryItemId !== inventoryItem.id,
  );

  if (occupiedSlot) {
    return {
      ok: false,
      message: "Ten slot jest juz zajety. Najpierw zdejmij aktywny przedmiot.",
    };
  }

  return { ok: true };
}

export function canUseConsumable(inventoryItem: InventoryItemSnapshot, studentId: string) {
  if (inventoryItem.studentId !== studentId) {
    return { ok: false, message: "Ten przedmiot nie nalezy do Twojej postaci." };
  }

  if (!inventoryItem.item.isConsumable) {
    return { ok: false, message: "Tego przedmiotu nie da sie uzyc jednorazowo." };
  }

  if (inventoryItem.quantity <= 0) {
    return { ok: false, message: "Ten przedmiot juz sie skonczyl." };
  }

  return { ok: true };
}

export type TaskItemDropSnapshot = {
  itemId: string;
  dropChanceBasisPoints: number;
  isActive: boolean;
  item?: { name: string };
};

export function pickTaskItemDrop(drops: TaskItemDropSnapshot[], rollBasisPoints: number) {
  if (rollBasisPoints < 0 || rollBasisPoints >= 10_000) {
    throw new Error("rollBasisPoints must be between 0 and 9999.");
  }

  let threshold = 0;

  for (const drop of drops.filter((entry) => entry.isActive)) {
    const chance = Math.max(0, Math.min(10_000, drop.dropChanceBasisPoints));
    threshold += chance;

    if (rollBasisPoints < threshold) {
      return drop;
    }
  }

  return null;
}

export function canBuyShopOffer(
  student: { id: string; money: number },
  offer: { price: number; isActive: boolean; item: { isConsumable: boolean } },
  existingItem?: { studentId: string; quantity: number } | null,
) {
  if (!offer.isActive) {
    return { ok: false, message: "Ten przedmiot zniknal ze sklepu. Pewnie poszedl na zajecia." };
  }

  if (offer.price <= 0) {
    return { ok: false, message: "Cena przedmiotu jest niepoprawna." };
  }

  if (existingItem && existingItem.studentId !== student.id) {
    return { ok: false, message: "Ten przedmiot nie nalezy do Twojej postaci." };
  }

  if (existingItem && !offer.item.isConsumable) {
    return {
      ok: false,
      message: "Masz juz ten przedmiot. Drugi egzemplarz nie miesci sie w regulaminie.",
    };
  }

  if (student.money < offer.price) {
    return { ok: false, message: "Masz za malo gotowki. Sklep nie przyjmuje obietnic." };
  }

  return { ok: true };
}

export function aggregateEquipmentBonuses(items: ItemDefinitionSnapshot[], taskCategory?: string) {
  return items.reduce(
    (bonuses, item) => ({
      knowledgeBonus: bonuses.knowledgeBonus + item.knowledgeBonus,
      maximumEnergyBonus: bonuses.maximumEnergyBonus + item.maximumEnergyBonus,
      energyRegenBonus: bonuses.energyRegenBonus + item.energyRegenBonus,
      reputationBonus: bonuses.reputationBonus + item.reputationBonus,
      moneyRewardBonus: bonuses.moneyRewardBonus + item.moneyRewardBonus,
      taskTimeBonus:
        bonuses.taskTimeBonus +
        (!item.taskCategory || item.taskCategory === taskCategory ? item.taskTimeBonus : 0),
    }),
    {
      knowledgeBonus: 0,
      maximumEnergyBonus: 0,
      energyRegenBonus: 0,
      reputationBonus: 0,
      moneyRewardBonus: 0,
      taskTimeBonus: 0,
    },
  );
}

export function applyConsumableEffect(
  student: { energy: number; maximumEnergy: number; stress: number },
  item: Pick<ItemDefinitionSnapshot, "energyRestore" | "stressReduce">,
) {
  return {
    energy: Math.min(student.maximumEnergy, student.energy + item.energyRestore),
    stress: clampStress(student.stress - item.stressReduce),
  };
}

export function describeItemBonuses(item: ItemDefinitionSnapshot) {
  const bonuses = [
    item.knowledgeBonus ? `Wiedza +${item.knowledgeBonus}` : null,
    item.maximumEnergyBonus ? `Maks. energia +${item.maximumEnergyBonus}` : null,
    item.energyRegenBonus ? `Regeneracja energii +${item.energyRegenBonus}%` : null,
    item.reputationBonus ? `Reputacja +${item.reputationBonus}` : null,
    item.moneyRewardBonus ? `Nagrody pieniezne +${item.moneyRewardBonus}%` : null,
    item.taskTimeBonus
      ? `Czas zadan${item.taskCategory ? ` (${item.taskCategory})` : ""} -${item.taskTimeBonus}%`
      : null,
    item.energyRestore ? `Odnawia ${item.energyRestore} energii` : null,
    item.stressReduce ? `Zmniejsza stres o ${item.stressReduce}` : null,
  ].filter(Boolean);

  return bonuses.length > 0 ? bonuses.join(", ") : "Bez bonusu. Ale wyglada profesjonalnie.";
}

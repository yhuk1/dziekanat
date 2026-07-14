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

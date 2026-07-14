import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  aggregateEquipmentBonuses,
  applyConsumableEffect,
  canEquipInventoryItem,
  canUseConsumable,
} from "./rules.ts";

const laptop = {
  slot: "device",
  isConsumable: false,
  knowledgeBonus: 1,
  maximumEnergyBonus: 0,
  energyRegenBonus: 0,
  reputationBonus: 0,
  moneyRewardBonus: 0,
  taskTimeBonus: 5,
  taskCategory: "Projekt",
  energyRestore: 0,
  stressReduce: 0,
};

describe("inventory rules", () => {
  it("allows equipping an owned item into a free slot", () => {
    const result = canEquipInventoryItem(
      {
        id: "inventory-1",
        studentId: "student-1",
        quantity: 1,
        item: laptop,
      },
      [],
    );

    assert.equal(result.ok, true);
  });

  it("rejects equipping two items in the same slot", () => {
    const result = canEquipInventoryItem(
      {
        id: "inventory-2",
        studentId: "student-1",
        quantity: 1,
        item: laptop,
      },
      [{ slot: "device", inventoryItemId: "inventory-1" }],
    );

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /slot/i);
  });

  it("uses consumables to restore energy and reduce stress", () => {
    const result = applyConsumableEffect(
      { energy: 80, maximumEnergy: 100, stress: 10 },
      { energyRestore: 30, stressReduce: 4 },
    );

    assert.deepEqual(result, { energy: 100, stress: 6 });
  });

  it("rejects using an item owned by another student", () => {
    const result = canUseConsumable(
      {
        id: "inventory-1",
        studentId: "student-2",
        quantity: 1,
        item: {
          ...laptop,
          slot: null,
          isConsumable: true,
          energyRestore: 10,
        },
      },
      "student-1",
    );

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /nie nalezy/i);
  });

  it("aggregates bonuses and applies task time only to matching categories", () => {
    const bonuses = aggregateEquipmentBonuses(
      [
        laptop,
        {
          ...laptop,
          slot: "bag",
          knowledgeBonus: 0,
          maximumEnergyBonus: 5,
          energyRegenBonus: 10,
          taskTimeBonus: 7,
          taskCategory: "Dziekanat",
        },
      ],
      "Projekt",
    );

    assert.deepEqual(bonuses, {
      knowledgeBonus: 1,
      maximumEnergyBonus: 5,
      energyRegenBonus: 10,
      reputationBonus: 0,
      moneyRewardBonus: 0,
      taskTimeBonus: 5,
    });
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canBuyShopOffer,
  aggregateEquipmentBonuses,
  applyConsumableEffect,
  canGrantStarterItems,
  canEquipInventoryItem,
  canUseConsumable,
  getStarterItemSlugs,
  pickTaskItemDrop,
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
  it("grants starter items only once and includes the study program item", () => {
    assert.equal(canGrantStarterItems({ starterItemsGranted: false }).ok, true);
    assert.equal(canGrantStarterItems({ starterItemsGranted: true }).ok, false);
    assert.deepEqual(getStarterItemSlugs("computer-science"), [
      "freshman-backpack",
      "library-card",
      "vending-machine-coffee",
      "old-cousin-laptop",
    ]);
  });

  it("picks an item from a task drop table using server-side roll", () => {
    const drops = [
      { itemId: "coffee", dropChanceBasisPoints: 2000, isActive: true },
      { itemId: "notes", dropChanceBasisPoints: 800, isActive: true },
    ];

    assert.equal(pickTaskItemDrop(drops, 1999)?.itemId, "coffee");
    assert.equal(pickTaskItemDrop(drops, 2000)?.itemId, "notes");
    assert.equal(pickTaskItemDrop(drops, 2800), null);
  });

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

  it("allows buying an active shop offer with enough money", () => {
    const result = canBuyShopOffer(
      { id: "student-1", money: 120 },
      { price: 80, isActive: true, item: { isConsumable: false } },
      null,
    );

    assert.equal(result.ok, true);
  });

  it("rejects shop purchase without enough money", () => {
    const result = canBuyShopOffer(
      { id: "student-1", money: 30 },
      { price: 80, isActive: true, item: { isConsumable: false } },
      null,
    );

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /malo gotowki/i);
  });

  it("prevents a duplicate non-consumable purchase but allows consumables", () => {
    const duplicateLaptop = canBuyShopOffer(
      { id: "student-1", money: 1000 },
      { price: 500, isActive: true, item: { isConsumable: false } },
      { studentId: "student-1", quantity: 1 },
    );
    const secondCoffee = canBuyShopOffer(
      { id: "student-1", money: 100 },
      { price: 10, isActive: true, item: { isConsumable: true } },
      { studentId: "student-1", quantity: 1 },
    );

    assert.equal(duplicateLaptop.ok, false);
    assert.equal(secondCoffee.ok, true);
  });

  it("rejects an item state belonging to another student during purchase checks", () => {
    const result = canBuyShopOffer(
      { id: "student-1", money: 1000 },
      { price: 100, isActive: true, item: { isConsumable: false } },
      { studentId: "student-2", quantity: 1 },
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

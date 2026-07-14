import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateServerEnergy, clampStress, getEffectiveEnergyRegenSeconds } from "./energy.ts";

describe("energy regeneration", () => {
  it("regenerates energy from server time and full intervals only", () => {
    const result = calculateServerEnergy(
      {
        energy: 50,
        maximumEnergy: 100,
        stress: 0,
        lastEnergyUpdateAt: new Date("2026-07-14T10:00:00.000Z"),
      },
      new Date("2026-07-14T10:16:00.000Z"),
    );

    assert.equal(result.energy, 53);
    assert.equal(result.regenerated, 3);
    assert.equal(result.lastEnergyUpdateAt.toISOString(), "2026-07-14T10:15:00.000Z");
  });

  it("never exceeds maximum energy", () => {
    const result = calculateServerEnergy(
      {
        energy: 99,
        maximumEnergy: 100,
        stress: 0,
        lastEnergyUpdateAt: new Date("2026-07-14T10:00:00.000Z"),
      },
      new Date("2026-07-14T11:00:00.000Z"),
    );

    assert.equal(result.energy, 100);
    assert.equal(result.regenerated, 1);
  });

  it("does not regenerate from a future timestamp", () => {
    const result = calculateServerEnergy(
      {
        energy: 50,
        maximumEnergy: 100,
        stress: 0,
        lastEnergyUpdateAt: new Date("2026-07-14T11:00:00.000Z"),
      },
      new Date("2026-07-14T10:00:00.000Z"),
    );

    assert.equal(result.energy, 50);
    assert.equal(result.regenerated, 0);
  });

  it("uses faster regeneration for medicine and slower regeneration at high stress", () => {
    assert.equal(getEffectiveEnergyRegenSeconds(0, "medicine"), 240);
    assert.equal(getEffectiveEnergyRegenSeconds(60, "medicine"), 300);
  });

  it("clamps stress to the supported range", () => {
    assert.equal(clampStress(-5), 0);
    assert.equal(clampStress(130), 100);
  });
});

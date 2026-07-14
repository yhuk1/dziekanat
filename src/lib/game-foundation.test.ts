import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyExperience, getRequiredExperience } from "./game-foundation.ts";

describe("game foundation rules", () => {
  it("calculates the required experience from the current level", () => {
    assert.equal(getRequiredExperience(1), 100);
    assert.equal(getRequiredExperience(3), 440);
  });

  it("keeps excess experience after a level up", () => {
    assert.deepEqual(applyExperience(1, 80, 45), { level: 2, experience: 25 });
  });

  it("can process more than one level up", () => {
    assert.deepEqual(applyExperience(1, 0, 360), { level: 3, experience: 6 });
  });
});

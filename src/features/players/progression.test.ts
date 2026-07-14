import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyExperience, getRequiredExperience } from "../../lib/game-foundation.ts";

describe("level progression thresholds", () => {
  it("uses growing experience thresholds", () => {
    assert.equal(getRequiredExperience(1), 100);
    assert.equal(getRequiredExperience(2), 254);
    assert.equal(getRequiredExperience(3), 440);
  });

  it("can level up and preserve excess experience", () => {
    assert.deepEqual(applyExperience(1, 80, 45), { level: 2, experience: 25 });
  });
});

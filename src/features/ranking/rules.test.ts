import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_RANKING_PAGE,
  RANKING_TYPES,
  calculatePositionFromSortedValues,
  getRankingOffset,
  parseRankingPage,
  parseRankingType,
} from "./rules.ts";

describe("ranking rules", () => {
  it("accepts only known ranking types", () => {
    assert.equal(parseRankingType("knowledge"), RANKING_TYPES.knowledge);
    assert.equal(parseRankingType("email"), RANKING_TYPES.level);
  });

  it("clamps page numbers to protect queries", () => {
    assert.equal(parseRankingPage("-5"), 1);
    assert.equal(parseRankingPage("9999"), MAX_RANKING_PAGE);
    assert.equal(getRankingOffset(3), 20);
  });

  it("calculates own position without private data", () => {
    assert.equal(calculatePositionFromSortedValues([10, 9, 9, 3], 9), 2);
    assert.equal(calculatePositionFromSortedValues([10, 9, 9, 3], 2), 5);
  });
});

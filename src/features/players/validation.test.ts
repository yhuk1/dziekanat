import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_STUDENT_STATS } from "./rules.ts";
import { createStudentSchema } from "./validation.ts";

describe("student creation rules", () => {
  it("keeps the requested initial student stats", () => {
    assert.deepEqual(INITIAL_STUDENT_STATS, {
      level: 1,
      experience: 0,
      knowledge: 10,
      energy: 100,
      maximumEnergy: 100,
      stress: 0,
      reputation: 0,
      money: 100,
      semester: 1,
    });
  });

  it("accepts a valid display name and study program id", () => {
    const result = createStudentSchema.safeParse({
      displayName: "Ada od Poprawek",
      studyProgramId: "cm12345678901234567890123",
    });

    assert.equal(result.success, true);
  });

  it("rejects suspicious display names", () => {
    const result = createStudentSchema.safeParse({
      displayName: "<script>alert(1)</script>",
      studyProgramId: "cm12345678901234567890123",
    });

    assert.equal(result.success, false);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EXAM_STATUS,
  canApplySemesterAdvance,
  canAttemptExam,
  resolveExamAttempt,
} from "./rules.ts";

const now = new Date("2026-07-14T12:00:00.000Z");

describe("semester exam rules", () => {
  it("rejects exam attempt when requirements are not met", () => {
    const result = canAttemptExam(
      {
        semester: 1,
        level: 1,
        knowledge: 5,
        stress: 0,
        studyProgramSlug: "computer-science",
      },
      0,
      null,
      now,
    );

    assert.equal(result.ok, false);
  });

  it("rejects retry before cooldown ends", () => {
    const result = canAttemptExam(
      {
        semester: 1,
        level: 2,
        knowledge: 30,
        stress: 0,
        studyProgramSlug: "computer-science",
      },
      5,
      {
        semester: 1,
        status: EXAM_STATUS.failed,
        nextAttemptAllowedAt: new Date("2026-07-14T12:30:00.000Z"),
      },
      now,
    );

    assert.equal(result.ok, false);
  });

  it("passes exam with enough score and advances semester", () => {
    const result = resolveExamAttempt(
      {
        semester: 1,
        level: 2,
        knowledge: 50,
        stress: 0,
        studyProgramSlug: "law",
      },
      { knowledgeBonus: 2, reputationBonus: 1 },
      now,
    );

    assert.equal(result.status, EXAM_STATUS.passed);
    assert.equal(result.nextSemester, 2);
    assert.equal(result.rewardMoney > 0, true);
  });

  it("fails exam and sets retry cooldown", () => {
    const result = resolveExamAttempt(
      {
        semester: 1,
        level: 1,
        knowledge: 12,
        stress: 80,
        studyProgramSlug: "management",
      },
      { knowledgeBonus: 0, reputationBonus: 0 },
      now,
    );

    assert.equal(result.status, EXAM_STATUS.failed);
    assert.equal(result.nextSemester, 1);
    assert.equal(result.nextAttemptAllowedAt?.toISOString(), "2026-07-14T13:00:00.000Z");
  });

  it("prevents applying semester advance twice", () => {
    assert.equal(canApplySemesterAdvance(1, 1, EXAM_STATUS.passed), true);
    assert.equal(canApplySemesterAdvance(2, 1, EXAM_STATUS.passed), false);
    assert.equal(canApplySemesterAdvance(1, 1, EXAM_STATUS.failed), false);
  });
});

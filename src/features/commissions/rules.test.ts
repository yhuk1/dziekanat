import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COMMISSION_STATUS,
  canAcceptCommission,
  canApproveCommission,
  canCancelCommission,
  canCreateCommission,
  canSubmitCommission,
} from "./rules.ts";

const future = new Date("2026-07-15T12:00:00.000Z");
const now = new Date("2026-07-14T12:00:00.000Z");

describe("student commission rules", () => {
  it("rejects creating without enough money for deposit", () => {
    const result = canCreateCommission({ money: 10 }, 20);

    assert.equal(result.ok, false);
  });

  it("rejects accepting own commission", () => {
    const result = canAcceptCommission(
      { id: "student-1", level: 3, money: 100 },
      {
        creatorId: "student-1",
        contractorId: null,
        minimumLevel: 1,
        moneyReward: 20,
        status: COMMISSION_STATUS.open,
        deadlineAt: future,
      },
      now,
    );

    assert.equal(result.ok, false);
  });

  it("rejects race-lost accepted commission", () => {
    const result = canAcceptCommission(
      { id: "student-2", level: 3, money: 100 },
      {
        creatorId: "student-1",
        contractorId: "student-3",
        minimumLevel: 1,
        moneyReward: 20,
        status: COMMISSION_STATUS.accepted,
        deadlineAt: future,
      },
      now,
    );

    assert.equal(result.ok, false);
  });

  it("allows cancellation only before acceptance by owner", () => {
    assert.equal(
      canCancelCommission("student-1", {
        creatorId: "student-1",
        status: COMMISSION_STATUS.open,
      }).ok,
      true,
    );
    assert.equal(
      canCancelCommission("student-1", {
        creatorId: "student-1",
        status: COMMISSION_STATUS.accepted,
      }).ok,
      false,
    );
  });

  it("allows contractor to submit before deadline", () => {
    const result = canSubmitCommission(
      "student-2",
      {
        creatorId: "student-1",
        contractorId: "student-2",
        minimumLevel: 1,
        moneyReward: 20,
        status: COMMISSION_STATUS.accepted,
        deadlineAt: future,
      },
      now,
    );

    assert.equal(result.ok, true);
  });

  it("prevents double payout by approving only submitted commissions", () => {
    const submitted = canApproveCommission("student-1", {
      creatorId: "student-1",
      contractorId: "student-2",
      minimumLevel: 1,
      moneyReward: 20,
      status: COMMISSION_STATUS.submitted,
      deadlineAt: future,
    });
    const alreadyApproved = canApproveCommission("student-1", {
      creatorId: "student-1",
      contractorId: "student-2",
      minimumLevel: 1,
      moneyReward: 20,
      status: COMMISSION_STATUS.approved,
      deadlineAt: future,
    });

    assert.equal(submitted.ok, true);
    assert.equal(alreadyApproved.ok, false);
  });
});

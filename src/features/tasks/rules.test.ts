import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TASK_STATUS,
  applyStudyProgramBonus,
  applyUniversityTaskRewards,
  canClaimUniversityTask,
  canStartUniversityTask,
} from "./rules.ts";

describe("university task rules", () => {
  const student = {
    level: 1,
    experience: 80,
    knowledge: 10,
    energy: 20,
    stress: 1,
    reputation: 0,
    money: 100,
  };

  const task = {
    minimumLevel: 1,
    energyCost: 10,
  };

  it("rejects starting a task without enough energy", () => {
    const result = canStartUniversityTask({ level: 1, energy: 5, stress: 0 }, task);

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /energii/i);
  });

  it("rejects starting a task with too low level", () => {
    const result = canStartUniversityTask(student, { minimumLevel: 2, energyCost: 10 });

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /poziomu/i);
  });

  it("rejects starting a second active task", () => {
    const result = canStartUniversityTask(student, task, { id: "active-task" });

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /aktywne zadanie/i);
  });

  it("rejects claiming a reward before the task is finished", () => {
    const result = canClaimUniversityTask(
      {
        status: TASK_STATUS.inProgress,
        finishesAt: new Date("2026-07-14T12:10:00.000Z"),
      },
      new Date("2026-07-14T12:00:00.000Z"),
    );

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /trwa/i);
  });

  it("rejects claiming a reward twice", () => {
    const result = canClaimUniversityTask(
      {
        status: TASK_STATUS.completed,
        finishesAt: new Date("2026-07-14T11:00:00.000Z"),
      },
      new Date("2026-07-14T12:00:00.000Z"),
    );

    assert.equal(result.ok, false);
    assert.match(result.message ?? "", /rozliczona/i);
  });

  it("applies rewards and levels up correctly", () => {
    const result = applyUniversityTaskRewards(student, {
      status: TASK_STATUS.inProgress,
      finishesAt: new Date("2026-07-14T11:00:00.000Z"),
      experienceReward: 45,
      moneyReward: 10,
      reputationReward: 3,
      knowledgeReward: 4,
      stressChange: 2,
    });

    assert.deepEqual(result, {
      level: 2,
      experience: 25,
      knowledge: 14,
      money: 110,
      reputation: 3,
      stress: 3,
    });
  });

  it("applies small study program bonuses", () => {
    assert.deepEqual(
      applyStudyProgramBonus(
        {
          category: "Projekt",
          minimumLevel: 1,
          energyCost: 10,
          experienceReward: 20,
          moneyReward: 20,
          reputationReward: 2,
          knowledgeReward: 10,
          stressChange: 1,
        },
        "computer-science",
      ),
      {
        experienceReward: 20,
        moneyReward: 20,
        reputationReward: 2,
        knowledgeReward: 11,
        stressChange: 1,
      },
    );
  });
});

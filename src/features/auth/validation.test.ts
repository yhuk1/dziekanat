import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authSchema } from "./validation.ts";

describe("auth validation", () => {
  it("normalizes e-mail and accepts a strong enough password", () => {
    const result = authSchema.parse({
      email: " STUDENT@UCZELNIA.TEST ",
      password: "minimum8",
    });

    assert.deepEqual(result, {
      email: "student@uczelnia.test",
      password: "minimum8",
    });
  });

  it("rejects short passwords", () => {
    const result = authSchema.safeParse({
      email: "student@uczelnia.test",
      password: "krotkie",
    });

    assert.equal(result.success, false);
  });
});

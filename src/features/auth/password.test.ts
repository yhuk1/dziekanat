import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, verifyPassword } from "./password.ts";

describe("password hashing", () => {
  it("stores a password as a non-plain scrypt hash", async () => {
    const hash = await hashPassword("bardzo-tajne-haslo");

    assert.notEqual(hash, "bardzo-tajne-haslo");
    assert.match(hash, /^scrypt:/);
  });

  it("verifies only the original password", async () => {
    const hash = await hashPassword("bardzo-tajne-haslo");

    assert.equal(await verifyPassword("bardzo-tajne-haslo", hash), true);
    assert.equal(await verifyPassword("zle-haslo", hash), false);
  });
});

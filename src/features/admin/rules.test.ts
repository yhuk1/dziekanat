import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canAccessAdmin, canAdminCancelCommission, canToggleUserBlock } from "./rules.ts";

describe("admin authorization rules", () => {
  it("allows only active admins to access admin panel", () => {
    assert.equal(canAccessAdmin({ role: "admin", isBlocked: false }), true);
    assert.equal(canAccessAdmin({ role: "player", isBlocked: false }), false);
    assert.equal(canAccessAdmin({ role: "admin", isBlocked: true }), false);
    assert.equal(canAccessAdmin(null), false);
  });

  it("rejects blocking or unblocking own account", () => {
    const result = canToggleUserBlock(
      { id: "admin-1", role: "admin", isBlocked: false },
      { id: "admin-1", role: "admin", isBlocked: false },
      true,
    );

    assert.equal(result.ok, false);
  });

  it("rejects user block changes from non-admins", () => {
    const result = canToggleUserBlock(
      { id: "user-1", role: "player", isBlocked: false },
      { id: "user-2", role: "player", isBlocked: false },
      true,
    );

    assert.equal(result.ok, false);
  });

  it("prevents blocking another administrator from the panel", () => {
    const result = canToggleUserBlock(
      { id: "admin-1", role: "admin", isBlocked: false },
      { id: "admin-2", role: "admin", isBlocked: false },
      true,
    );

    assert.equal(result.ok, false);
  });

  it("allows emergency commission cancellation only before payout", () => {
    assert.equal(canAdminCancelCommission({ status: "open" }).ok, true);
    assert.equal(canAdminCancelCommission({ status: "submitted" }).ok, true);
    assert.equal(canAdminCancelCommission({ status: "approved" }).ok, false);
    assert.equal(canAdminCancelCommission({ status: "cancelled" }).ok, false);
  });
});

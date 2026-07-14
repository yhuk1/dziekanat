export const USER_ROLE = {
  player: "player",
  admin: "admin",
} as const;

export const ADMIN_ACTION = {
  blockUser: "block_user",
  unblockUser: "unblock_user",
  createTask: "create_task",
  updateTask: "update_task",
  disableTask: "disable_task",
  createItem: "create_item",
  updateItem: "update_item",
  cancelCommission: "cancel_commission",
} as const;

export function canAccessAdmin(user: { role: string; isBlocked: boolean } | null) {
  return Boolean(user && user.role === USER_ROLE.admin && !user.isBlocked);
}

export function canToggleUserBlock(
  adminUser: { id: string; role: string; isBlocked: boolean },
  targetUser: { id: string; role: string; isBlocked: boolean },
  shouldBlock: boolean,
) {
  if (!canAccessAdmin(adminUser)) {
    return { ok: false, message: "Brak uprawnien administratora." };
  }

  if (adminUser.id === targetUser.id) {
    return { ok: false, message: "Nie mozna zablokowac ani odblokowac wlasnego konta." };
  }

  if (targetUser.role === USER_ROLE.admin && shouldBlock) {
    return { ok: false, message: "Nie blokuj innego administratora z panelu gry." };
  }

  if (targetUser.isBlocked === shouldBlock) {
    return { ok: false, message: "Konto jest juz w tym stanie." };
  }

  return { ok: true };
}

export function canAdminCancelCommission(commission: { status: string }) {
  if (commission.status === "approved") {
    return { ok: false, message: "Zatwierdzonego zlecenia nie mozna juz anulowac." };
  }

  if (commission.status === "cancelled") {
    return { ok: false, message: "To zlecenie jest juz anulowane." };
  }

  return { ok: true };
}

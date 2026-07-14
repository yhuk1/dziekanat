export const COMMISSION_STATUS = {
  open: "open",
  accepted: "accepted",
  submitted: "submitted",
  approved: "approved",
  cancelled: "cancelled",
  overdue: "overdue",
} as const;

export const COMMISSION_CATEGORIES = [
  "Notatki",
  "Projekt",
  "Prezentacja",
  "Grafika",
  "Ankieta",
  "Konferencja",
  "Techniczne",
] as const;

export type CommissionStatus = (typeof COMMISSION_STATUS)[keyof typeof COMMISSION_STATUS];

export type CommissionStudentSnapshot = {
  id: string;
  level: number;
  money: number;
};

export type CommissionSnapshot = {
  creatorId: string;
  contractorId: string | null;
  minimumLevel: number;
  moneyReward: number;
  status: string;
  deadlineAt: Date;
};

export function canCreateCommission(
  student: Pick<CommissionStudentSnapshot, "money">,
  reward: number,
) {
  if (!Number.isInteger(reward) || reward < 1) {
    return { ok: false, message: "Nagroda musi byc dodatnia liczba." };
  }

  if (student.money < reward) {
    return { ok: false, message: "Masz za malo pieniedzy na depozyt zlecenia." };
  }

  return { ok: true };
}

export function canAcceptCommission(
  student: CommissionStudentSnapshot,
  commission: CommissionSnapshot,
  now: Date,
) {
  if (commission.status !== COMMISSION_STATUS.open) {
    return { ok: false, message: "To zlecenie nie jest juz dostepne." };
  }

  if (commission.creatorId === student.id) {
    return { ok: false, message: "Nie mozna przyjac wlasnego zlecenia." };
  }

  if (student.level < commission.minimumLevel) {
    return { ok: false, message: "Masz za niski poziom na to zlecenie." };
  }

  if (commission.deadlineAt <= now) {
    return { ok: false, message: "Termin tego zlecenia juz minal." };
  }

  return { ok: true };
}

export function canCancelCommission(
  studentId: string,
  commission: Pick<CommissionSnapshot, "creatorId" | "status">,
) {
  if (commission.creatorId !== studentId) {
    return { ok: false, message: "Nie mozesz anulowac cudzego zlecenia." };
  }

  if (commission.status !== COMMISSION_STATUS.open) {
    return { ok: false, message: "Zlecenie mozna anulowac tylko przed przyjeciem." };
  }

  return { ok: true };
}

export function canSubmitCommission(studentId: string, commission: CommissionSnapshot, now: Date) {
  if (commission.contractorId !== studentId) {
    return { ok: false, message: "Tylko wykonawca moze oznaczyc zlecenie jako wykonane." };
  }

  if (commission.status !== COMMISSION_STATUS.accepted) {
    return { ok: false, message: "To zlecenie nie jest w trakcie wykonywania." };
  }

  if (commission.deadlineAt <= now) {
    return { ok: false, message: "Termin zlecenia minal." };
  }

  return { ok: true };
}

export function canApproveCommission(studentId: string, commission: CommissionSnapshot) {
  if (commission.creatorId !== studentId) {
    return { ok: false, message: "Tylko wystawiajacy moze zatwierdzic wykonanie." };
  }

  if (commission.status !== COMMISSION_STATUS.submitted) {
    return { ok: false, message: "To zlecenie nie czeka na zatwierdzenie." };
  }

  if (!commission.contractorId) {
    return { ok: false, message: "Zlecenie nie ma wykonawcy." };
  }

  return { ok: true };
}

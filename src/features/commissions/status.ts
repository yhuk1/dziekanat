export function getCommissionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    open: "Otwarte",
    accepted: "Przyjete",
    submitted: "Do zatwierdzenia",
    approved: "Zatwierdzone",
    cancelled: "Anulowane",
    overdue: "Po terminie",
  };

  return labels[status] ?? status;
}

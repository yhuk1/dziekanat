import { AdminShell } from "@/features/admin/components";
import { requireAdmin } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

export default async function AdminAuditLogPage() {
  await requireAdmin();
  const logs = await prisma.adminAuditLog.findMany({
    include: { adminUser: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AdminShell
      title="Dziennik operacji"
      description="Kto, co i kiedy kliknal. Dziekanat moze zgubic formularz, ale audyt nie powinien."
    >
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">Ostatnie wpisy audytu</h2>
        <div className="mt-4 divide-y divide-ink/10">
          {logs.map((log) => (
            <div key={log.id} className="grid gap-2 py-3 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black text-ink">{log.action}</p>
                <p className="text-sm text-ink/65">{log.details}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ink/45">
                  {log.targetType}
                  {log.targetId ? ` · ${log.targetId}` : ""} · admin: {log.adminUser.email}
                </p>
              </div>
              <div className="text-sm font-bold text-ink/55 md:text-right">
                <p>{log.createdAt.toLocaleString("pl-PL")}</p>
                {log.economyChange ? (
                  <p className="mt-1 rounded-md bg-warning/10 px-2 py-1 text-warning">
                    ekonomia gry
                  </p>
                ) : null}
              </div>
            </div>
          ))}
          {logs.length === 0 ? (
            <p className="py-3 text-ink/65">Brak wpisow. Cisza administracyjna, rzadki okaz.</p>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}

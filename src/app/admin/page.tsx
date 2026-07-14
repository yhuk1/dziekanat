import { Search } from "lucide-react";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { toggleUserBlockAction } from "@/features/admin/actions";
import { AdminShell } from "@/features/admin/components";
import { requireAdmin } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

type AdminUsersPageProps = {
  searchParams: Promise<{ q?: string; error?: string; success?: string }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const [users, students] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        student: { select: { displayName: true, level: true, semester: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    query
      ? prisma.student.findMany({
          where: { displayName: { contains: query } },
          include: {
            user: { select: { email: true, role: true, isBlocked: true } },
            studyProgram: true,
          },
          orderBy: { displayName: "asc" },
          take: 20,
        })
      : [],
  ]);

  return (
    <AdminShell
      title="Kontrola indeksow i kont"
      description="Tu widac konta, blokady i wyszukiwarke postaci. Hashy hasel nie ma, bo to nie gablotka."
    >
      <StatusMessage error={params.error} success={params.success} />

      <form className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel sm:flex-row">
        <label className="flex-1 text-sm font-bold text-ink/70">
          Szukaj postaci
          <input
            name="q"
            defaultValue={query}
            placeholder="np. Jan z Informatyki"
            className="mt-1 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white hover:bg-accent sm:self-end"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Szukaj
        </button>
      </form>

      {query ? (
        <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
          <h2 className="text-2xl font-black text-ink">Wyniki wyszukiwania postaci</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {students.map((student) => (
              <div key={student.id} className="grid gap-2 py-3 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black text-ink">{student.displayName}</p>
                  <p className="text-sm text-ink/60">
                    {student.studyProgram.name}, poziom {student.level}, semestr {student.semester}
                  </p>
                </div>
                <p className="text-sm font-bold text-ink/55">
                  {student.user.email} ·{" "}
                  {student.user.isBlocked ? "zablokowane" : student.user.role}
                </p>
              </div>
            ))}
            {students.length === 0 ? (
              <p className="py-3 text-ink/65">Brak wynikow. Moze postac ukryla sie w kolejce.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">Ostatni uzytkownicy</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-ink/50">
              <tr>
                <th className="py-2">E-mail</th>
                <th>Postac</th>
                <th>Rola</th>
                <th>Status</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 font-bold text-ink">{user.email}</td>
                  <td className="text-ink/65">
                    {user.student
                      ? `${user.student.displayName}, lvl ${user.student.level}, sem. ${user.student.semester}`
                      : "brak postaci"}
                  </td>
                  <td className="font-bold text-ink/65">{user.role}</td>
                  <td className="font-bold text-ink/65">
                    {user.isBlocked ? "zablokowane" : "aktywne"}
                  </td>
                  <td>
                    <form action={toggleUserBlockAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="hidden"
                        name="intent"
                        value={user.isBlocked ? "unblock" : "block"}
                      />
                      <SubmitButton
                        pendingLabel="Zapisywanie..."
                        className={
                          user.isBlocked ? "bg-success hover:bg-ink" : "bg-warning hover:bg-ink"
                        }
                      >
                        {user.isBlocked ? "Odblokuj" : "Zablokuj"}
                      </SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}

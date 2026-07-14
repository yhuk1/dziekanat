import Link from "next/link";
import type { UniversityTask } from "@prisma/client";
import { StatusMessage } from "@/components/ui/status-message";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  disableUniversityTaskAdminAction,
  saveUniversityTaskAdminAction,
} from "@/features/admin/actions";
import { AdminShell, CheckboxField, Field } from "@/features/admin/components";
import { requireAdmin } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

type AdminTasksPageProps = {
  searchParams: Promise<{ edit?: string; error?: string; success?: string }>;
};

export default async function AdminTasksPage({ searchParams }: AdminTasksPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const [tasks, editedTask] = await Promise.all([
    prisma.universityTask.findMany({
      orderBy: [{ isActive: "desc" }, { minimumLevel: "asc" }, { title: "asc" }],
      take: 100,
    }),
    params.edit ? prisma.universityTask.findUnique({ where: { id: params.edit } }) : null,
  ]);

  return (
    <AdminShell
      title="Zadania uczelni"
      description="Tworzysz i poprawiasz zadania, ktore karmia glowna petle gry. Nagrody sa audytowane."
    >
      <StatusMessage error={params.error} success={params.success} />
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">
          {editedTask ? "Edytuj zadanie" : "Nowe zadanie"}
        </h2>
        <TaskForm task={editedTask} />
      </section>
      <section className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel">
        <h2 className="text-2xl font-black text-ink">Lista zadan</h2>
        <div className="mt-4 divide-y divide-ink/10">
          {tasks.map((task) => (
            <div key={task.id} className="grid gap-3 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-paper px-2 py-1 text-xs font-black uppercase tracking-widest text-accent">
                    {task.category}
                  </span>
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-black text-white">
                    lvl {task.minimumLevel}
                  </span>
                  <span className="rounded-md bg-paper px-2 py-1 text-xs font-black text-ink/65">
                    {task.isActive ? "aktywne" : "wylaczone"}
                  </span>
                </div>
                <p className="mt-2 font-black text-ink">{task.title}</p>
                <p className="text-sm text-ink/60">
                  XP {task.experienceReward}, zl {task.moneyReward}, reputacja{" "}
                  {task.reputationReward}, energia {task.energyCost}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/tasks?edit=${task.id}`}
                  className="rounded-md border border-ink/15 px-4 py-2 text-sm font-black text-ink hover:border-accent hover:text-accent"
                >
                  Edytuj
                </Link>
                {task.isActive ? (
                  <form action={disableUniversityTaskAdminAction}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <SubmitButton pendingLabel="Wylaczanie..." className="bg-warning hover:bg-ink">
                      Wylacz
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function TaskForm({ task }: { task: UniversityTask | null }) {
  return (
    <form action={saveUniversityTaskAdminAction} className="mt-4 grid gap-4 lg:grid-cols-2">
      {task ? <input type="hidden" name="id" value={task.id} /> : null}
      <Field label="Slug techniczny" name="slug" defaultValue={task?.slug} />
      <Field label="Tytul" name="title" defaultValue={task?.title} />
      <Field label="Opis" name="description" defaultValue={task?.description} textarea />
      <Field label="Kategoria" name="category" defaultValue={task?.category} />
      <Field
        label="Minimalny poziom"
        name="minimumLevel"
        type="number"
        defaultValue={task?.minimumLevel ?? 1}
      />
      <Field
        label="Czas w sekundach"
        name="durationSeconds"
        type="number"
        defaultValue={task?.durationSeconds ?? 300}
      />
      <Field
        label="Koszt energii"
        name="energyCost"
        type="number"
        defaultValue={task?.energyCost ?? 10}
      />
      <Field
        label="Nagroda XP"
        name="experienceReward"
        type="number"
        defaultValue={task?.experienceReward ?? 20}
      />
      <Field
        label="Nagroda gotowki"
        name="moneyReward"
        type="number"
        defaultValue={task?.moneyReward ?? 5}
      />
      <Field
        label="Nagroda reputacji"
        name="reputationReward"
        type="number"
        defaultValue={task?.reputationReward ?? 1}
      />
      <Field
        label="Nagroda wiedzy"
        name="knowledgeReward"
        type="number"
        defaultValue={task?.knowledgeReward ?? 1}
      />
      <Field
        label="Zmiana stresu"
        name="stressChange"
        type="number"
        defaultValue={task?.stressChange ?? 0}
      />
      <div className="flex items-end gap-3">
        <CheckboxField
          label="Aktywne na tablicy"
          name="isActive"
          defaultChecked={task?.isActive ?? true}
        />
        <SubmitButton pendingLabel="Zapisywanie...">Zapisz zadanie</SubmitButton>
      </div>
    </form>
  );
}

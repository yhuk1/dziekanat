import Link from "next/link";

export function AdminHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/78 p-5 shadow-panel md:p-7">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">
        Panel administratora
      </p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-ink/70">{description}</p>
    </div>
  );
}

export function AdminNav() {
  const links = [
    { href: "/admin", label: "Uzytkownicy" },
    { href: "/admin/tasks", label: "Zadania" },
    { href: "/admin/items", label: "Przedmioty" },
    { href: "/admin/commissions", label: "Zlecenia" },
    { href: "/admin/audit-log", label: "Audyt" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white hover:bg-accent"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function AdminShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-5">
        <AdminHeader title={title} description={description} />
        <AdminNav />
        {children}
      </section>
    </div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  textarea?: boolean;
}) {
  const className =
    "mt-1 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <label className="text-sm font-bold text-ink/70">
      {label}
      {textarea ? (
        <textarea
          name={name}
          defaultValue={String(defaultValue ?? "")}
          rows={3}
          className={className}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={String(defaultValue ?? "")}
          className={className}
        />
      )}
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md bg-paper px-3 py-2 text-sm font-bold text-ink/75">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}

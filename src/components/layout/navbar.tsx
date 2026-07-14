import Link from "next/link";
import { GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

const links = [
  { href: "/", label: "Start" },
  { href: "/dashboard", label: "Panel" },
  { href: "/tasks", label: "Zadania" },
  { href: "/inventory", label: "Ekwipunek" },
  { href: "/commissions", label: "Zlecenia" },
  { href: "/ranking", label: "Ranking" },
  { href: "/exam", label: "Egzamin" },
];

export async function Navbar() {
  const user = await getCurrentUser();
  const visibleLinks =
    user?.role === "admin" ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/88 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-black text-ink">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate">Dziekanat</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-ink/70 transition hover:bg-white/70 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-warning focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Wyloguj
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:inline-flex"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Logowanie
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

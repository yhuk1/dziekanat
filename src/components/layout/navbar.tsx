import Link from "next/link";
import {
  Backpack,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Medal,
  ShoppingBag,
  ScrollText,
  Shield,
  Swords,
} from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

const links = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/tasks", label: "Zadania", icon: ClipboardList },
  { href: "/inventory", label: "Ekwipunek", icon: Backpack },
  { href: "/shop", label: "Sklep", icon: ShoppingBag },
  { href: "/commissions", label: "Zlecenia", icon: ScrollText },
  { href: "/ranking", label: "Ranking", icon: Medal },
  { href: "/exam", label: "Egzamin", icon: Swords },
];

export async function Navbar() {
  const user = await getCurrentUser();
  const visibleLinks = user
    ? user.role === "admin"
      ? [...links, { href: "/admin", label: "Admin", icon: Shield }]
      : links
    : [];

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/92 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-md font-black text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="Dziekanat: Gra o Zaliczenie - strona glowna"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-ink text-white shadow-lg shadow-ink/20">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg leading-tight">Dziekanat</span>
            <span className="block truncate text-xs font-bold uppercase tracking-widest text-accent">
              Gra o Zaliczenie
            </span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent bg-white/40 px-3 py-2 text-sm font-bold text-ink/75 transition hover:-translate-y-0.5 hover:border-accent/25 hover:bg-white hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              <link.icon className="h-4 w-4 text-accent" aria-hidden="true" />
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
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Zaloz konto
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Logowanie
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";
import { loginAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user?.student) {
    redirect("/dashboard");
  }

  if (user) {
    redirect("/student/create");
  }

  const params = await searchParams;

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white/78 p-6 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Logowanie</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Wroc do indeksu</h1>
        <p className="mt-3 text-ink/70">
          Podaj dane konta. System sprawdzi haslo po stronie serwera, bez sciagania komisji
          egzaminacyjnej.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <FormError message={params.error} />
          <label className="block">
            <span className="text-sm font-bold text-ink/70">E-mail</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink/70">Haslo</span>
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <SubmitButton pendingLabel="Logowanie...">Zaloguj sie</SubmitButton>
        </form>

        <p className="mt-5 text-sm text-ink/65">
          Nie masz konta?{" "}
          <Link href="/register" className="font-black text-accent hover:text-ink">
            Zaloz konto
          </Link>
        </p>
      </section>
    </div>
  );
}

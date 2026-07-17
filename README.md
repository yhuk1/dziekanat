# Dziekanat: Gra o Zaliczenie

Przegladarkowa gra RPG/management o przetrwaniu wspolczesnej uczelni. Gracz rozwija studenta, zarzadza energia, zdobywa doswiadczenie, pieniadze i reputacje oraz probuje przejsc przez semestr bez dramatycznego starcia z formularzem A-17.

## Status

Projekt ma dzialajacy fundament gry oraz kilka rozszerzen po MVP. Zawiera:

- Next.js z TypeScript,
- Tailwind CSS,
- Prisma z lokalna baza SQLite,
- rejestracje, logowanie, sesje i blokade kont,
- tworzenie jednej postaci studenta na konto,
- panel gracza pod `/dashboard`,
- zadania uczelni z energia, czasem, nagrodami i historia,
- regeneracje energii, stres, bonusy kierunkow i dziennik nagrod,
- ekwipunek, przedmioty jednorazowe, dropy z zadan i sklep uczelniany,
- zlecenia miedzy studentami z depozytem,
- rankingi,
- egzaminy semestralne,
- panel administratora pod `/admin`,
- podstawowy layout i nawigacje,
- lint, formatowanie i testy.

Projekt nadal nie zawiera prawdziwych platnosci, mikroplatnosci, czatu, gildii ani romansow.

## Wymagania

- Node.js 22 lub nowszy,
- npm.

## Pierwsze uruchomienie

1. Zainstaluj zaleznosci:

```bash
npm install
```

2. Utworz lokalny plik srodowiskowy:

```bash
cp .env.example .env
```

Na Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Uruchom migracje bazy:

```bash
npm run prisma:migrate
```

4. Wgraj dane startowe:

```bash
npm run prisma:seed
```

5. Uruchom aplikacje developerska:

```bash
npm run dev
```

Domyslny adres aplikacji:

```text
http://localhost:3000
```

## Przydatne komendy

```bash
npm run dev
```

Uruchamia aplikacje lokalnie.

```bash
npm run lint
```

Sprawdza jakosc kodu przez ESLint.

```bash
npm run format
```

Formatuje pliki przez Prettier.

```bash
npm run format:check
```

Sprawdza formatowanie bez zapisywania zmian.

```bash
npm run test
```

Uruchamia testy jednostkowe.

```bash
npm run build
```

Generuje klienta Prisma i buduje aplikacje produkcyjna.

## Baza danych

Lokalna baza uzywa SQLite:

```env
DATABASE_URL="file:./dev.db"
```

Plik bazy znajduje sie lokalnie w katalogu `prisma/` i nie jest commitowany do repozytorium. Schemat jest trzymany w `prisma/schema.prisma`, a konfiguracja CLI Prismy w `prisma.config.ts`.

`prisma.config.ts` laduje lokalny plik `.env`, wskazuje aktualna lokalizacje schematu i definiuje komende seedowania. Zmienna `DATABASE_URL` pozostaje pojedynczym miejscem ustawiania polaczenia z baza; lokalnie wskazuje SQLite, a przy pozniejszej migracji na PostgreSQL powinna wskazywac docelowy adres bazy.

## Deploy na Vercel

Projekt jest przygotowany do darmowego deploya na Vercel, ale produkcja powinna uzywac PostgreSQL. Lokalny plik SQLite (`file:./dev.db`) jest dobry na komputerze, lecz nie nadaje sie jako trwala baza dla aplikacji uruchomionej na Vercel.

1. Wgraj repozytorium na GitHub.
2. Wejdz na [vercel.com](https://vercel.com) i wybierz `Add New Project`.
3. Zaimportuj repozytorium `yhuk1/dziekanat`.
4. Dodaj baze PostgreSQL do projektu, np. Prisma Postgres z zakladki Storage/Marketplace Vercela. Integracja powinna ustawic zmienna `DATABASE_URL`.
5. Zostaw build command z `vercel.json`: `npm run vercel-build`.
6. Uruchom deploy.

Dla Vercela uzywany jest osobny schemat Prismy:

```text
prisma/postgres/schema.prisma
```

oraz osobne migracje:

```text
prisma/postgres/migrations/
```

Lokalne komendy nadal uzywaja SQLite i pliku `prisma/schema.prisma`. Produkcyjny build Vercela uruchamia migracje PostgreSQL, generuje klienta Prisma, wykonuje seed i buduje Next.js.

## Konto administratora

Panel administratora jest dostepny pod `/admin` tylko dla kont z rola `admin`.

Najprostsza lokalna sciezka:

1. W pliku `.env` ustaw:

```env
ADMIN_EMAIL="twoj-admin@example.com"
ADMIN_PASSWORD="lokalne-haslo-min-8-znakow"
```

2. Uruchom seed:

```bash
npm run prisma:seed
```

Seed utworzy konto administratora, jezeli nie istnieje, albo nada role `admin` istniejacemu kontu o tym adresie e-mail. Nie wpisuj prawdziwych sekretow do `.env.example` ani do repozytorium.

## Seed

Seed tworzy:

- kierunki studiow: Informatyka, Zarzadzanie, Prawo, Medycyna, Grafika,
- definicje zadan uczelni,
- definicje przedmiotow,
- przykladowe zlecenia, jezeli istnieje juz przynajmniej jedna postac,
- opcjonalne konto administratora, jezeli ustawisz `ADMIN_EMAIL` i `ADMIN_PASSWORD`.

Seed mozna uruchomic ponownie:

```bash
npm run prisma:seed
```

## Struktura katalogow

```text
src/
  app/
    admin/
    commissions/
    dashboard/
    exam/
    inventory/
    ranking/
    shop/
    tasks/
  components/
    layout/
    ui/
  features/
    admin/
    auth/
    commissions/
    dashboard/
    exams/
    inventory/
    players/
    ranking/
    shop/
    study-programs/
    tasks/
  lib/
prisma/
  schema.prisma
  seed.mjs
docs/
  GAME_DESIGN.md
  ROADMAP.md
```

## Zasady projektu

- Kod i nazwy techniczne sa po angielsku.
- Interfejs uzytkownika jest po polsku.
- Dane gry nie sa przechowywane w `localStorage` jako glowne zrodlo prawdy.
- Nagrody, koszty energii i statusy zadan maja byc walidowane po stronie serwera.
- Projekt nie zawiera mikroplatnosci ani prawdziwych platnosci.
- Projekt nie kopiuje grafik, nazw, opisow ani kodu z innych gier.

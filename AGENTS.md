# AGENTS.md

## Cel repozytorium

To repozytorium zawiera gre `Dziekanat: Gra o Zaliczenie`: przegladarkowe RPG/management o rozwoju studenta na wspolczesnej, fikcyjnej uczelni.

Projekt ma byc autorski. Nie wolno kopiowac grafik, nazw, opisow, mechanik fabularnych ani kodu z Gladiatusa ani innych gier.

## Jezyk projektu

- Kod, nazwy plikow, nazwy modeli, zmienne, funkcje, komponenty i endpointy pisz po angielsku.
- Interfejs uzytkownika, komunikaty, tresci zadan i teksty widoczne dla gracza pisz po polsku.
- Dokumentacje projektowa mozna pisac po polsku.
- Komentarze w kodzie dodawaj oszczednie i tylko wtedy, gdy wyjasniaja nieoczywista decyzje.

## Zalozenia techniczne

- Framework: Next.js z TypeScript.
- Style: Tailwind CSS.
- ORM: Prisma.
- Lokalna baza danych: SQLite.
- Schemat bazy powinien byc przygotowany tak, aby pozniejsza migracja na PostgreSQL byla mozliwie prosta.
- Waliduj dane po stronie serwera.
- Nie ufaj danym z klienta przy naliczaniu nagrod, kosztow energii, poziomow ani statusow zadan.
- Interfejs musi byc responsywny i wygodny na telefonie oraz komputerze.

## Architektura

- Preferuj prosta, czytelna architekture.
- Nie dodawaj abstrakcji bez wyraznej potrzeby.
- Logike domenowa trzymaj poza komponentami UI, jezeli jest wspoldzielona albo testowalna.
- Komponenty UI powinny byc male, nazwane jasno i skupione na jednym zadaniu.
- Operacje zmieniajace stan gry musza przechodzic przez kontrolowana warstwe serwerowa.
- Unikaj duplikowania zasad balansu w wielu miejscach.

## MVP

Pierwsze MVP obejmuje:

- rejestracje i logowanie,
- utworzenie studenta,
- wybor kierunku,
- panel gracza,
- liste zadan od uczelni,
- rozpoczecie i ukonczenie zadania,
- koszt energii,
- czas wykonywania zadania,
- nagrody w postaci doswiadczenia, pieniedzy i reputacji,
- zdobywanie poziomow,
- historie wykonanych zadan.

Nie dodawaj do MVP, o ile uzytkownik nie poprosi wyraznie:

- mikroplatnosci,
- prawdziwych platnosci,
- zaawansowanego ekwipunku,
- rankingu,
- zlecen miedzy studentami,
- romansow i relacji,
- gildii lub grup,
- panelu administracyjnego,
- moderacji tresci graczy.

## Dane i balans

Podstawowe statystyki studenta:

- `level`
- `experience`
- `knowledge`
- `energy`
- `maximumEnergy`
- `stress`
- `reputation`
- `money`
- `semester`

Przykladowe kierunki:

- Informatyka
- Zarzadzanie
- Prawo
- Medycyna
- Grafika

Kazdy kierunek moze w przyszlosci dawac niewielki, charakterystyczny bonus. Bonusy nie powinny tworzyc jednej dominujacej strategii.

## Bezpieczenstwo i integralnosc gry

- Nie naliczaj nagrod po stronie klienta.
- Sprawdzaj po stronie serwera, czy student ma wystarczajaca energie.
- Sprawdzaj po stronie serwera, czy zadanie faktycznie moze byc ukonczone.
- Nie pozwalaj klientowi przekazywac wlasnych wartosci nagrod.
- Operacje ekonomii gry powinny byc atomowe tam, gdzie ma to znaczenie.
- Unikaj funkcji, ktore ulatwiaja transfer zasobow miedzy kontami, dopoki nie ma zabezpieczen.

## UI i UX

- UI ma byc po polsku.
- Projektuj najpierw realny panel gry, nie marketingowa strone startowa.
- Widoki powinny byc czytelne na telefonie.
- Najwazniejsze informacje gracza: energia, level, experience, pieniadze i reputacja powinny byc latwe do znalezienia.
- Komunikaty bledow powinny byc zrozumiale dla gracza.
- Nie uzywaj prawdziwych logotypow uczelni bez wyraznej potrzeby i praw.

## Praca z repozytorium

- Przed zmianami sprawdz aktualny stan plikow.
- Nie cofaj zmian uzytkownika bez wyraznej prosby.
- Trzymaj zmiany w zakresie aktualnego zadania.
- Aktualizuj dokumentacje, gdy zmienia sie zakres gry albo decyzje architektoniczne.
- Jezeli dodajesz zaleznosc, musi miec jasne uzasadnienie.
- Po zmianach uruchom dostepne testy lub walidacje, jezeli projekt je posiada.

## Konwencje implementacyjne na przyszlosc

- Modele Prisma nazywaj po angielsku.
- Polskie teksty gry trzymaj jako dane lub stala warstwe prezentacji, nie jako nazwy techniczne.
- Dla walidacji formularzy preferuj wspoldzielone schematy walidacyjne, jezeli projekt je wprowadzi.
- Daty i czasy zadan przechowuj w sposob jednoznaczny dla serwera.
- Przy projektowaniu statusow uzywaj jawnych enumow lub jasno ograniczonych wartosci.

# Dziekanat: Gra o Zaliczenie - Game Design

## Cel projektu

`Dziekanat: Gra o Zaliczenie` to przegladarkowa gra RPG/management osadzona w autorskim swiecie wspolczesnej uczelni. Gracz prowadzi studenta przez kolejne semestry, rozwija statystyki, wykonuje zadania uczelniane, zdobywa doswiadczenie, pieniadze i reputacje oraz zarzadza energia i stresem.

Gra jest inspirowana ogolnym modelem rozwoju postaci i wykonywania aktywnosci znanym z gier przegladarkowych, ale nie kopiuje nazw, opisow, grafik, mechanik fabularnych ani kodu z zadnej konkretnej gry.

## Rozsadne MVP

Pierwsze MVP powinno udowodnic, ze podstawowa petla gry jest przyjemna i technicznie stabilna. Zakres MVP:

- rejestracja i logowanie,
- utworzenie studenta dla konta gracza,
- wybor kierunku studiow,
- panel gracza z podstawowymi statystykami,
- lista zadan od uczelni,
- rozpoczecie zadania, jezeli student ma wystarczajaco energii,
- czas wykonywania zadania,
- ukonczenie zadania i odebranie nagrod,
- koszt energii,
- nagrody: experience, money, reputation,
- zdobywanie poziomow,
- historia wykonanych zadan.

MVP nie musi jeszcze zawierac walki, ekwipunku z pelnymi bonusami, zaawansowanego rankingu, relacji romantycznych ani zadan wystawianych przez innych studentow.

## Aktualny stan implementacji

Repozytorium wyszlo poza pierwsze MVP. Oprocz podstawowej petli konta, postaci i zadan uczelni zaimplementowane sa juz:

- regeneracja energii i system stresu,
- bonusy kierunkow studiow,
- przedmioty, ekwipunek i przedmioty jednorazowe,
- zlecenia miedzy studentami z depozytem,
- rankingi,
- semestry i egzaminy,
- panel administratora z audytem operacji.

Te funkcje nadal powinny trzymac sie zasad projektu: brak prawdziwych platnosci, brak zaufania do klienta przy nagrodach i kosztach, walidacja po stronie serwera oraz brak kopiowania cudzych zasobow.

## Glowna petla rozgrywki

1. Gracz loguje sie do konta.
2. Jezeli nie ma studenta, tworzy go i wybiera kierunek studiow.
3. W panelu widzi statystyki: level, experience, knowledge, energy, maximum energy, stress, reputation, money i semester.
4. Gracz wybiera zadanie od uczelni.
5. System sprawdza wymagania, koszt energii i aktualny stan studenta.
6. Zadanie zostaje rozpoczete i trwa okreslony czas.
7. Po uplywie czasu gracz konczy zadanie i odbiera nagrody.
8. Student otrzymuje doswiadczenie, pieniadze i reputacje.
9. Po przekroczeniu progu doswiadczenia student awansuje na kolejny poziom.
10. Gracz wraca do panelu, podejmuje kolejne zadania i planuje zuzycie energii.

Docelowo petla zostanie rozszerzona o regeneracje energii, stres jako realne ograniczenie, przedmioty, ranking, relacje, semestry i zlecenia spolecznosciowe.

## Statystyki studenta

Podstawowe statystyki wymagane w MVP:

- `level` - poziom studenta. Wplywa na dostepnosc trudniejszych zadan i przyszlych funkcji.
- `experience` - doswiadczenie zdobywane za zadania. Po osiagnieciu progu powoduje awans.
- `knowledge` - wiedza studenta. W MVP moze byc widoczna, ale jej pelne uzycie moze pojawic sie pozniej.
- `energy` - aktualna energia potrzebna do rozpoczynania zadan.
- `maximumEnergy` - maksymalna energia studenta.
- `stress` - poziom stresu. W MVP widoczny jako parametr, pozniej moze ograniczac efektywnosc.
- `reputation` - reputacja na uczelni, zdobywana za zadania.
- `money` - waluta gry, bez powiazania z prawdziwymi platnosciami.
- `semester` - aktualny semestr studiow.

Przykladowe wartosci startowe:

- `level`: 1
- `experience`: 0
- `knowledge`: 0
- `energy`: 100
- `maximumEnergy`: 100
- `stress`: 0
- `reputation`: 0
- `money`: 50
- `semester`: 1

## Kierunki studiow

W MVP kierunek jest wyborem tozsamosciowym i przyszlym fundamentem bonusow. Nie powinien jeszcze komplikowac balansu, ale model danych powinien pozwalac na dodanie bonusow.

Przykladowe kierunki:

- Informatyka
- Zarzadzanie
- Prawo
- Medycyna
- Grafika

Docelowe bonusy powinny byc niewielkie i charakterystyczne:

- Informatyka: drobny bonus do zadan technicznych lub wiedzy.
- Zarzadzanie: drobny bonus do pieniedzy lub reputacji.
- Prawo: drobny bonus do zadan administracyjnych i reputacji.
- Medycyna: drobny bonus do kontroli stresu albo efektywnosci trudnych zadan.
- Grafika: drobny bonus do kreatywnych zadan i zlecen spolecznosciowych.

Wazne: bonusy nie powinny tworzyc jednej oczywiscie najlepszej sciezki. Kazdy kierunek powinien dawac lekki styl gry, nie dominujaca przewage.

## System poziomow i doswiadczenia

W MVP poziomowanie powinno byc proste i czytelne:

- zadania daja okreslona liczbe punktow `experience`,
- po osiagnieciu progu student awansuje,
- nadmiar doswiadczenia przechodzi na kolejny poziom,
- awans moze w przyszlosci zwiekszac `maximumEnergy`, odblokowywac zadania i zwiekszac dostep do funkcji.

Proponowany prog na start:

```text
requiredExperience = level * 100
```

Ten wzor jest prosty do testowania. W pozniejszym balansie mozna go zastapic tabela progow lub lagodniejsza krzywa.

## Energia i stres

Energia jest glownym ograniczeniem aktywnosci w MVP:

- kazde zadanie ma `energyCost`,
- gracz nie moze rozpoczac zadania, jezeli ma za malo energii,
- energia jest odejmowana przy rozpoczeciu zadania,
- regeneracja energii moze zostac dodana w kolejnym etapie po podstawowym MVP.

Stres jest drugim zasobem, ale w pierwszym MVP powinien byc ostroznie uzywany:

- w MVP moze byc tylko widoczny i zapisywany,
- pozniej zadania moga zwiekszac stres,
- wysoki stres moze obnizac nagrody, blokowac trudne zadania albo wymagac odpoczynku,
- przedmioty i aktywnosci moga redukowac stres.

## Zadania od uczelni

Zadania od uczelni sa podstawowa aktywnoscia w MVP. Kazde zadanie powinno miec:

- nazwe po polsku,
- opis po polsku,
- minimalny poziom,
- koszt energii,
- czas trwania,
- nagrode w doswiadczeniu,
- nagrode w pieniadzach,
- nagrode w reputacji,
- opcjonalny wplyw na stres,
- status aktywnosci gracza.

Przykladowe zadania:

- Oddaj zalegly formularz
- Pomoz w laboratorium
- Przygotuj notatki dla grupy
- Odbierz podpis z sekretariatu
- Wez udzial w kole naukowym

W MVP zadanie moze miec deterministyczne nagrody. Losowosc warto dodac dopiero po stworzeniu testow i panelu historii.

## Nagrody

Nagrody w MVP:

- `experience` - podstawowy postep postaci,
- `money` - zasob do przyszlych zakupow,
- `reputation` - status spoleczny i uczelniany.

Pozniejsze nagrody:

- `knowledge`,
- przedmioty,
- redukcja stresu,
- odblokowanie kontaktow,
- punkty semestralne,
- specjalne osiagniecia.

Nagrody powinny byc walidowane po stronie serwera. Klient nie moze samodzielnie decydowac o wyniku zadania.

## Przedmioty

Przedmioty nie sa wymagane w pierwszym MVP, ale model gry powinien zostawic na nie miejsce.

Przykladowe typy przedmiotow:

- materialy do nauki,
- sprzet elektroniczny,
- ubrania i dodatki,
- jedzenie i napoje,
- przedmioty specjalne zwiazane z wydarzeniami.

Mozliwe efekty:

- zwiekszenie `knowledge`,
- zwiekszenie `maximumEnergy`,
- redukcja `stress`,
- bonus do `money` z okreslonych zadan,
- bonus do `reputation`,
- skrocenie czasu okreslonych aktywnosci.

Przedmioty powinny byc dodane dopiero wtedy, gdy podstawowa petla zadan bedzie stabilna.

## Pozniejsze zadania miedzy studentami

Po MVP mozna dodac system zlecen wystawianych przez innych studentow. Ta funkcja powinna byc projektowana ostroznie, poniewaz wymaga zasad antynaduzyciowych i moderacji.

Mozliwy zakres:

- student tworzy zlecenie,
- okresla opis, nagrode w pieniadzach i wymagany poziom,
- inny student przyjmuje zlecenie,
- system blokuje nagrode do czasu ukonczenia,
- po ukonczeniu zlecenie trafia do historii obu stron.

Ograniczenia:

- brak prawdziwych platnosci,
- limity liczby aktywnych zlecen,
- filtrowanie i moderacja opisow,
- zabezpieczenie przed transferem zasobow miedzy multikontami.

## Ranking

Ranking nie jest wymagany w pierwszym MVP. Po dodaniu stabilnej petli gry mozna wprowadzic:

- ranking poziomu,
- ranking reputacji,
- ranking pieniedzy,
- ranking wykonanych zadan,
- ranking semestru.

Ranking powinien unikac nadmiernego premiowania samego czasu spedzonego w grze. Warto rozdzielic rankingi sezonowe i calkowite.

## Romanse i relacje

Relacje i romanse sa funkcja pozniejsza. Powinny byc lekkie, humorystyczne i dobrowolne, bez tresci naruszajacych bezpieczenstwo lub prywatnosc.

Mozliwe podejscie:

- fikcyjne postacie niezalezne,
- proste watki dialogowe,
- bonusy kosmetyczne lub male bonusy mechaniczne,
- brak mechanik manipulacyjnych i brak prawdziwych platnosci.

Relacje miedzy prawdziwymi graczami powinny byc rozwazane dopiero po wprowadzeniu moderacji, zgloszen i jasnych zasad spolecznosci.

## Funkcje poza pierwszym MVP

Nastepujace funkcje nie powinny wejsc do pierwszego MVP:

- zaawansowany ekwipunek,
- sklep z przedmiotami,
- regeneracja energii w czasie rzeczywistym, jezeli opoznia podstawowe MVP,
- rozbudowany system stresu,
- zadania miedzy studentami,
- ranking,
- semestry z egzaminami koncowymi,
- romanse i relacje,
- osiagniecia,
- powiadomienia,
- administracyjny panel zarzadzania trescia,
- moderacja tresci graczy,
- sezonowosc,
- gildie, grupy lub kola studenckie jako system spolecznosciowy,
- jakiekolwiek mikroplatnosci lub prawdziwe platnosci.

## Zalozenia techniczne

- Framework: Next.js z TypeScript.
- UI: responsywny interfejs dla telefonu i komputera.
- Style: Tailwind CSS.
- Baza danych: Prisma.
- Lokalna baza: SQLite.
- Docelowa mozliwosc migracji: PostgreSQL.
- Walidacja: dane walidowane po stronie serwera.
- Kod, nazwy modeli, funkcji i zmiennych: angielski.
- Interfejs uzytkownika, tresci zadan i komunikaty: polski.
- Architektura: czytelna, bez nadmiernego komplikowania.
- Platnosci: brak mikroplatnosci i brak prawdziwych platnosci.

## Proponowane encje domenowe

Nazwy techniczne powinny byc po angielsku:

- `User` - konto gracza.
- `Student` - postac gracza.
- `StudyProgram` - kierunek studiow.
- `UniversityTask` - definicja zadania od uczelni.
- `StudentTask` - aktywne lub zakonczone zadanie studenta.
- `TaskHistoryEntry` albo historia oparta o `StudentTask` ze statusem `completed`.
- `Item` - definicja przedmiotu, poza MVP.
- `InventoryItem` - przedmiot posiadany przez studenta, poza MVP.

## Statusy zadan

Proponowane statusy techniczne:

- `available` - zadanie moze zostac rozpoczete.
- `in_progress` - zadanie jest wykonywane.
- `completed` - zadanie zostalo ukonczone i nagrody zostaly przyznane.
- `failed` - status przyszlosciowy, poza MVP.
- `cancelled` - status przyszlosciowy, poza MVP.

W bazie lepiej przechowywac statusy aktywnosci studenta, a nie globalny status definicji zadania.

## Zasady balansu MVP

- Pierwsze zadania powinny miec niski koszt energii.
- Gracz powinien moc wykonac kilka zadan przed wyczerpaniem energii.
- Awans na poziom 2 powinien byc mozliwy podczas krotkiej sesji testowej.
- Nagrody powinny byc jawne przed rozpoczeciem zadania.
- Kara za blad uzytkownika powinna byc minimalna, poniewaz pierwsze MVP sluzy testowaniu petli, nie karaniu gracza.

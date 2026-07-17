# Dziekanat: Gra o Zaliczenie - Roadmap

## Etap 1: Plan gry i zasady projektu

Cel: ustalic zakres MVP, kierunek projektu i zasady pracy.

Zakres:

- opis glownej petli rozgrywki,
- opis statystyk studenta,
- opis kierunkow studiow,
- opis systemu zadan uczelnianych,
- opis nagrod, energii, stresu i poziomow,
- lista funkcji poza MVP,
- trwale zasady pracy w `AGENTS.md`.

Rezultat:

- `docs/GAME_DESIGN.md`
- `docs/ROADMAP.md`
- `AGENTS.md`

## Etap 2: Szkielet aplikacji

Cel: przygotowac techniczny fundament projektu.

Zakres:

- utworzenie aplikacji Next.js z TypeScript,
- konfiguracja Tailwind CSS,
- podstawowy layout responsywny,
- konfiguracja formatowania i lintowania,
- przygotowanie struktury katalogow,
- pierwsza strona startowa lub przekierowanie do panelu.

Rezultat:

- aplikacja uruchamiana lokalnie,
- spojny styl kodu,
- gotowe miejsce na logike domenowa.

## Etap 3: Baza danych i modele domenowe

Cel: przygotowac warstwe danych pod MVP.

Zakres:

- konfiguracja Prisma,
- SQLite dla lokalnego developmentu,
- schemat przygotowany z mysla o pozniejszym PostgreSQL,
- modele: `User`, `Student`, `StudyProgram`, `UniversityTask`, `StudentTask`,
- seedy z przykladowymi kierunkami i zadaniami,
- podstawowa dokumentacja zmiennych srodowiskowych.

Rezultat:

- dzialajace migracje,
- lokalna baza z danymi startowymi,
- modele zgodne z zalozeniami MVP.

## Etap 4: Uwierzytelnianie

Cel: umozliwic graczowi rejestracje i logowanie.

Zakres:

- rejestracja,
- logowanie,
- wylogowanie,
- ochrona tras wymagajacych konta,
- walidacja danych po stronie serwera,
- podstawowe komunikaty bledow po polsku.

Rezultat:

- gracz moze utworzyc konto i zalogowac sie,
- niezalogowany uzytkownik nie ma dostepu do panelu gry.

## Etap 5: Tworzenie studenta

Cel: pozwolic graczowi stworzyc postac.

Zakres:

- formularz tworzenia studenta,
- wybor kierunku studiow,
- zapis startowych statystyk,
- blokada tworzenia wielu studentow dla jednego konta w MVP,
- przekierowanie do panelu gracza po utworzeniu postaci.

Rezultat:

- konto ma przypisana jedna postac studenta,
- panel moze wyswietlac statystyki.

## Etap 6: Panel gracza

Cel: pokazac najwazniejszy stan gry.

Zakres:

- widok statystyk studenta,
- aktualny kierunek i semestr,
- pasek doswiadczenia,
- energia i stres,
- pieniadze i reputacja,
- responsywny uklad dla telefonu i komputera.

Rezultat:

- gracz rozumie stan postaci po wejsciu do panelu.

## Etap 7: Zadania od uczelni

Cel: wdrozyc podstawowa petle rozgrywki.

Zakres:

- lista dostepnych zadan,
- szczegoly kosztu energii, czasu i nagrod,
- rozpoczecie zadania,
- zapis czasu zakonczenia,
- blokada startu bez energii,
- ukonczenie zadania po uplywie czasu,
- przyznanie nagrod po stronie serwera,
- awans poziomu po zdobyciu doswiadczenia.

Rezultat:

- gracz moze wykonywac zadania i rozwijac postac.

## Etap 8: Historia zadan

Cel: dac graczowi czytelny zapis postepow.

Zakres:

- lista zakonczonych zadan,
- data rozpoczecia i ukonczenia,
- zdobyte nagrody,
- statusy zadan aktywnych i zakonczonych,
- podstawowe puste stany UI.

Rezultat:

- gracz widzi, co wykonal i jakie nagrody zdobyl.

## Etap 9: Testy i stabilizacja MVP

Cel: przygotowac MVP do dalszej rozbudowy.

Zakres:

- testy logiki poziomowania,
- testy walidacji rozpoczynania i konczenia zadan,
- testy serwerowych akcji lub endpointow,
- sprawdzenie responsywnosci,
- poprawa komunikatow bledow,
- podstawowy hardening sesji i walidacji.

Rezultat:

- MVP jest stabilne i gotowe na pierwsze testy uzytkownikow.

## Etap 10: Rozszerzenia po MVP

Cel: rozwijac gre bez rozbijania podstawowej petli.

Mozliwe rozszerzenia:

- regeneracja energii,
- pelniejszy system stresu,
- przedmioty i ekwipunek,
- sklep za walute gry,
- bonusy kierunkow,
- semestry i egzaminy,
- ranking,
- osiagniecia,
- zlecenia miedzy studentami,
- relacje i romanse z fikcyjnymi postaciami,
- panel administracyjny do zarzadzania zadaniami,
- moderacja tresci tworzonych przez graczy.

Status: wiekszosc rozszerzen technicznych z tej listy zostala juz rozpoczeta lub wdrozona w prostej wersji: regeneracja energii, stres, przedmioty, zestawy startowe, dropy zadan, sklep uczelniany, bonusy kierunkow, semestry i egzaminy, ranking, zlecenia miedzy studentami oraz panel administracyjny. Nadal poza zakresem sa prawdziwe platnosci, czat, gildie, romanse oraz rozbudowana moderacja spolecznosci.

## Priorytet implementacji MVP

Rekomendowana kolejnosc:

1. Szkielet Next.js, TypeScript i Tailwind CSS.
2. Prisma, SQLite i podstawowe modele.
3. Seedy kierunkow i zadan uczelnianych.
4. Rejestracja, logowanie i ochrona tras.
5. Tworzenie studenta i wybor kierunku.
6. Panel gracza.
7. Lista zadan od uczelni.
8. Start i ukonczenie zadania.
9. Nagrody, energia i poziomowanie.
10. Historia wykonanych zadan.
11. Testy i balans pierwszych wartosci.

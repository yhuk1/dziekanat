# Dziekanat: Gra o Zaliczenie - Graphics Guide

Ten dokument opisuje sposob przechowywania i dodawania grafik gry. Grafiki maja wspierac klimat nowoczesnej gry przegladarkowej osadzonej na uczelni, ale nie moga kopiowac cudzych zasobow, stylu, nazw ani kompozycji z innych gier.

## Struktura katalogow

Grafiki gry przechowujemy w katalogu `public/images/`.

```text
public/
  images/
    backgrounds/
    characters/
    icons/
    tasks/
    items/
    exams/
    events/
    ranking/
```

Zastosowanie katalogow:

- `backgrounds/` - tla stron, panele kampusu, ilustracje hero i tla dashboardu.
- `characters/` - portrety studentow, warianty kierunkow, postacie pomocnicze.
- `icons/` - ikony autorskie, jezeli nie wystarcza biblioteka ikon w kodzie.
- `tasks/` - ilustracje zadan uczelnianych i kategorii zadan.
- `items/` - ilustracje przedmiotow, ekwipunku i przedmiotow jednorazowych.
- `exams/` - grafiki egzaminow, sukcesow, porazek i przebiegu starcia.
- `events/` - grafiki powiadomien, awansow, rzadkich zdarzen i nagrod.
- `ranking/` - grafiki widoku rankingow, podium i tablicy chwaly.

## Format grafik

Preferowany format to `WebP`, poniewaz dobrze laczy jakosc i rozmiar pliku.

Dopuszczalne formaty:

- `.webp` - domyslny format dla ilustracji i assetow gry.
- `.png` - tylko gdy potrzebna jest przezroczystosc albo asset pochodzi z procesu, ktory nie eksportuje dobrze WebP.
- `.svg` - tylko dla prostych, autorskich ikon lub znakow technicznych. Nie uzywac SVG jako zamiennika pelnych ilustracji.

Unikamy:

- ciezkich plikow bez kompresji,
- zewnetrznych hotlinkow,
- losowych grafik stockowych,
- grafik z prawdziwymi logotypami uczelni bez praw do uzycia.

## Rekomendowane proporcje

Rekomendacje sa orientacyjne. Ostateczne wymiary powinny wynikac z miejsca uzycia w UI.

- Hero i szerokie tla desktopowe: `16:9`, np. `1920x1080`.
- Hero mobilne: `4:5` albo `9:16`, np. `1080x1350` lub `1080x1920`.
- Karty zadan: `4:3` albo `3:2`, np. `1200x900` lub `1200x800`.
- Portrety postaci: `1:1` albo `4:5`, np. `1024x1024` lub `1024x1280`.
- Przedmioty: `1:1`, np. `1024x1024`.
- Powiadomienia i eventy: `16:9` albo `3:2`.
- Ranking i podium: `16:9` dla tla, `1:1` dla ikon/rang.

Dla obrazow widocznych w kartach warto zachowac stabilne proporcje, aby UI nie skakal podczas ladowania.

## Nazewnictwo plikow

Nazwy plikow musza byc techniczne i przewidywalne:

- wylacznie male litery,
- bez polskich znakow,
- bez spacji,
- slowa oddzielone myslnikami,
- nazwy po angielsku,
- preferowane rozszerzenie `.webp`.

Dobre przyklady:

```text
hero-home.webp
hero-home-mobile.webp
task-printer-battle.webp
item-old-laptop.webp
exam-success.webp
event-level-up.webp
ranking-background.webp
```

Zle przyklady:

```text
Grafika Studenta.png
zadanie_żółty.jpg
final final 2.webp
hero-home.1webp.png
```

Jezeli grafika ma wariant mobilny, dodaj suffix `-mobile`.

```text
hero-home.webp
hero-home-mobile.webp
```

Jezeli grafika ma wariant alternatywny, dodaj opisowy suffix.

```text
exam-success.webp
exam-success-night.webp
```

## Wersje desktopowe i mobilne

Dla duzych grafik hero oraz szerokich tla przygotowujemy osobne wersje:

- desktop: szeroka kompozycja, zwykle `16:9`,
- mobile: kadr pionowy albo ciaśniejszy, bez waznych detali przy krawedziach.

Kod powinien wybierac wariant przez responsywne komponenty obrazu, media queries albo `next/image`, kiedy obraz zostanie podlaczony do UI.

Wersje mobilne nie powinny byc tylko automatycznie przycietym desktopem, jezeli kadr traci istotny element.

## Teksty alternatywne

Kazda grafika informacyjna musi miec sensowny tekst alternatywny.

Zasady:

- alt opisuje znaczenie obrazu, nie tylko jego wyglad,
- alt jest krotki i konkretny,
- dekoracyjne tla moga miec pusty alt, jezeli nie niosa informacji,
- nie powtarzamy tekstu widocznego obok obrazu,
- nie opieramy informacji wylacznie na kolorze.

Przyklady:

```text
alt="Student walczacy z uczelniana drukarka"
alt="Karta przedmiotu: stary laptop po kuzynie"
alt=""
```

## Dodawanie nowych grafik

1. Wybierz katalog odpowiadajacy zastosowaniu grafiki.
2. Nadaj nazwe zgodna z zasadami nazewnictwa.
3. Preferuj eksport do WebP.
4. Sprawdz rozmiar pliku i skompresuj obraz, jezeli jest zbyt ciezki.
5. Dodaj wersje mobilna, jezeli obraz bedzie uzywany jako hero albo szerokie tlo.
6. W kodzie uzywaj stabilnych wymiarow lub proporcji, aby uniknac przesuwania layoutu.
7. Dodaj tekst alternatywny, jezeli grafika niesie informacje.
8. Nie zapisuj w grafice tekstow interfejsu, ktore powinny byc renderowane przez aplikacje.

## Tekst w ilustracjach

Nie osadzamy tekstu interfejsu bezposrednio w ilustracjach. Dotyczy to etykiet przyciskow, komunikatow, nazw nagrod, opisow zadan i informacji o stanie gracza.

Powody:

- tekst w kodzie latwiej przetlumaczyc i poprawic,
- tekst w obrazie jest mniej dostepny dla czytnikow ekranu,
- tekst w obrazie gorzej skaluje sie na telefonie,
- UI moze zmieniac stan bez generowania nowej grafiki.

Dopuszczalne sa drobne elementy swiata gry, np. fikcyjna kartka na tablicy albo napis na plakacie, o ile nie zastepuja interfejsu i nie sa wymagane do zrozumienia akcji.

## Kontrola przed dodaniem

Przed dodaniem grafiki sprawdz:

- czy plik jest autorski albo mamy prawo go uzyc,
- czy nazwa jest zgodna z konwencja,
- czy format i rozmiar sa rozsadne,
- czy obraz pasuje do klimatu uczelni i gry RPG/management,
- czy nie zawiera prawdziwych logotypow uczelni,
- czy nie zawiera tekstu, ktory powinien byc czescia UI,
- czy istnieje alt albo decyzja, ze obraz jest dekoracyjny.

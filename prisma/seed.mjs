import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

const studyPrograms = [
  {
    slug: "computer-science",
    name: "Informatyka",
    description: "Dla osob, ktore wiedza, ze blad w konsoli tez potrafi byc forma literatury.",
    bonusLabel: "Bonus: +10% wiedzy z projektow.",
  },
  {
    slug: "management",
    name: "Zarzadzanie",
    description: "Prezentacje, tabelki i spokojny usmiech, gdy wszystko plonie w harmonogramie.",
    bonusLabel: "Bonus: +8% pieniedzy ze wszystkich zadan.",
  },
  {
    slug: "law",
    name: "Prawo",
    description: "Pieczatki, paragrafy i sztuka zadawania pytan, na ktore nikt nie byl gotowy.",
    bonusLabel: "Bonus: +10% reputacji z zadan dziekanatowych.",
  },
  {
    slug: "medicine",
    name: "Medycyna",
    description: "Duzo nauki, malo snu i podejrzanie dobra znajomosc kawy z automatu.",
    bonusLabel: "Bonus: energia odnawia sie co 4 minuty zamiast co 5.",
  },
  {
    slug: "graphic-design",
    name: "Grafika",
    description:
      "Kazdy projekt jest prawie gotowy, dopoki prowadzacy nie powie: jeszcze jedna wersja.",
    bonusLabel: "Bonus: +10% pieniedzy i wiedzy z projektow kreatywnych.",
  },
];

const universityTasks = [
  {
    slug: "survive-8am-lecture",
    title: "Przetrwaj wyklad o 8:00",
    description: "Udawaj notowanie, walcz z powiekami i odkryj, ze kawa ma limit many.",
    category: "Wykład",
    minimumLevel: 1,
    energyCost: 10,
    durationSeconds: 300,
    experienceReward: 25,
    moneyReward: 4,
    reputationReward: 1,
    knowledgeReward: 6,
    stressChange: 1,
  },
  {
    slug: "recover-lecturer-signature",
    title: "Odzyskaj podpis prowadzacego",
    description: "Prowadzacy byl widziany trzy budynki temu. Trop prowadzi do pokoju bez numeru.",
    category: "Dziekanat",
    minimumLevel: 1,
    energyCost: 12,
    durationSeconds: 600,
    experienceReward: 35,
    moneyReward: 8,
    reputationReward: 3,
    knowledgeReward: 2,
    stressChange: 2,
  },
  {
    slug: "find-free-room",
    title: "Znajdz wolna sale",
    description: "Plan zajec twierdzi jedno, tabliczka drugie, a grupa na korytarzu trzecie.",
    category: "Dziekanat",
    minimumLevel: 1,
    energyCost: 9,
    durationSeconds: 240,
    experienceReward: 20,
    moneyReward: 5,
    reputationReward: 2,
    knowledgeReward: 1,
    stressChange: 1,
  },
  {
    slug: "deliver-documents-to-office",
    title: "Dostarcz dokumenty do dziekanatu",
    description:
      "Masz komplet dokumentow. Prawie. Brakuje tylko tego, o ktorym nikt nie wspomnial.",
    category: "Dziekanat",
    minimumLevel: 1,
    energyCost: 14,
    durationSeconds: 720,
    experienceReward: 40,
    moneyReward: 10,
    reputationReward: 4,
    knowledgeReward: 2,
    stressChange: 2,
  },
  {
    slug: "last-minute-presentation",
    title: "Przygotuj prezentacje piec minut przed zajeciami",
    description: "Slajd pierwszy: tytul. Slajd drugi: nadzieja. Slajd trzeci: bibliografia.",
    category: "Projekt",
    minimumLevel: 1,
    energyCost: 18,
    durationSeconds: 900,
    experienceReward: 50,
    moneyReward: 12,
    reputationReward: 4,
    knowledgeReward: 5,
    stressChange: 3,
  },
  {
    slug: "get-notes-from-older-year",
    title: "Zdobadz notatki od starszego rocznika",
    description: "Plik nazywa sie FINAL_v7_poprawione_serio.pdf. To dobry znak. Chyba.",
    category: "Wykład",
    minimumLevel: 1,
    energyCost: 11,
    durationSeconds: 480,
    experienceReward: 30,
    moneyReward: 6,
    reputationReward: 3,
    knowledgeReward: 8,
    stressChange: -1,
  },
  {
    slug: "fix-group-project",
    title: "Napraw projekt grupowy po pozostalych czlonkach zespolu",
    description: "Repozytorium placze, deadline oddycha ci w kark, a commit message brzmi: dziala.",
    category: "Projekt",
    minimumLevel: 2,
    energyCost: 24,
    durationSeconds: 1500,
    experienceReward: 80,
    moneyReward: 18,
    reputationReward: 7,
    knowledgeReward: 8,
    stressChange: 4,
  },
  {
    slug: "help-conference",
    title: "Pomoz przy organizacji konferencji",
    description: "Nos identyfikatory, ustaw krzesla i udawaj, ze wiesz, gdzie jest sala B.",
    category: "Wydarzenie uczelniane",
    minimumLevel: 2,
    energyCost: 20,
    durationSeconds: 1200,
    experienceReward: 65,
    moneyReward: 20,
    reputationReward: 8,
    knowledgeReward: 3,
    stressChange: 2,
  },
  {
    slug: "campus-survey",
    title: "Przeprowadz ankiete na kampusie",
    description: "Zapytaj 30 osob, czy maja dwie minuty. Statystycznie nikt nie ma.",
    category: "Koło naukowe",
    minimumLevel: 1,
    energyCost: 16,
    durationSeconds: 840,
    experienceReward: 45,
    moneyReward: 14,
    reputationReward: 5,
    knowledgeReward: 4,
    stressChange: 1,
  },
  {
    slug: "defeat-campus-printer",
    title: "Wygraj starcie z uczelniana drukarka",
    description: "Papier jest. Toner jest. Godnosc drukarki nie jest.",
    category: "Dziekanat",
    minimumLevel: 1,
    energyCost: 13,
    durationSeconds: 540,
    experienceReward: 38,
    moneyReward: 9,
    reputationReward: 4,
    knowledgeReward: 2,
    stressChange: 3,
  },
  {
    slug: "tutor-first-year-student",
    title: "Wytlumacz pierwszakowi, gdzie jest aula",
    description: "Sam nie masz pewnosci, ale mowisz spokojnym glosem. To polowa sukcesu.",
    category: "Wydarzenie uczelniane",
    minimumLevel: 2,
    energyCost: 12,
    durationSeconds: 600,
    experienceReward: 42,
    moneyReward: 10,
    reputationReward: 7,
    knowledgeReward: 2,
    stressChange: -1,
  },
  {
    slug: "part-time-cafe-shift",
    title: "Odbebnij zmiane w kampusowej kawiarni",
    description:
      "Spien mleko, usmiechnij sie i nie pytaj, czemu latte zamawia prowadzacy od statystyki.",
    category: "Praca dorywcza",
    minimumLevel: 1,
    energyCost: 22,
    durationSeconds: 1800,
    experienceReward: 55,
    moneyReward: 45,
    reputationReward: 2,
    knowledgeReward: 1,
    stressChange: 2,
  },
  {
    slug: "science-club-poster",
    title: "Zaprojektuj plakat kola naukowego",
    description: "Ma byc nowoczesnie, akademicko i najlepiej na wczoraj. Klasyka briefu.",
    category: "Koło naukowe",
    minimumLevel: 2,
    energyCost: 18,
    durationSeconds: 1100,
    experienceReward: 60,
    moneyReward: 16,
    reputationReward: 8,
    knowledgeReward: 5,
    stressChange: 1,
  },
  {
    slug: "library-archive-expedition",
    title: "Wyprawa do archiwum biblioteki",
    description: "Znajdz ksiazke, ktorej sygnatura wyglada jak haslo do Wi-Fi z 2006 roku.",
    category: "Wykład",
    minimumLevel: 2,
    energyCost: 17,
    durationSeconds: 1000,
    experienceReward: 58,
    moneyReward: 8,
    reputationReward: 4,
    knowledgeReward: 12,
    stressChange: 1,
  },
  {
    slug: "student-event-night-shift",
    title: "Dopilnuj wydarzenia uczelnianego do pozna",
    description: "Naglosnienie dziala, lista gosci zniknela, a ktos pyta o przedluzacz.",
    category: "Wydarzenie uczelniane",
    minimumLevel: 3,
    energyCost: 28,
    durationSeconds: 2400,
    experienceReward: 105,
    moneyReward: 35,
    reputationReward: 12,
    knowledgeReward: 6,
    stressChange: 4,
  },
];

const itemDefinitions = [
  {
    slug: "old-cousin-laptop",
    name: "Stary laptop po kuzynie",
    description: "Wentylator brzmi jak odrzutowiec, ale projekty dalej sie kompilują. Zwykle.",
    category: "Laptop",
    slot: "device",
    rarity: "Pospolity",
    knowledgeBonus: 1,
    taskTimeBonus: 3,
    taskCategory: "Projekt",
  },
  {
    slug: "scientific-calculator",
    name: "Kalkulator naukowy",
    description: "Ma wiecej przyciskow niz odwagi przed kolokwium.",
    category: "Akcesorium",
    slot: "accessory",
    rarity: "Pospolity",
    knowledgeBonus: 1,
  },
  {
    slug: "organizer-calendar",
    name: "Kalendarz organizatora",
    description: "Kolorowe zakladki, twarda okladka i zludzenie kontroli nad tygodniem.",
    category: "Akcesorium",
    slot: "accessory",
    rarity: "Pospolity",
    moneyRewardBonus: 1,
  },
  {
    slug: "basic-law-code",
    name: "Podstawowy kodeks",
    description: "Ciezszy niz wyglada i gotowy wygrac kazda dyskusje samym upadkiem na stol.",
    category: "Podrecznik",
    slot: "notes",
    rarity: "Pospolity",
    reputationBonus: 1,
  },
  {
    slug: "anatomy-textbook",
    name: "Podrecznik anatomii",
    description: "Tyle stron, ze sam w sobie powinien dawac punkty za aktywnosc fizyczna.",
    category: "Podrecznik",
    slot: "notes",
    rarity: "Pospolity",
    knowledgeBonus: 1,
    energyRegenBonus: 5,
  },
  {
    slug: "freshman-sketchbook",
    name: "Szkicownik pierwszoroczniaka",
    description: "Pierwsza strona idealna, druga juz zawiera miniaturke prowadzacego.",
    category: "Notatki",
    slot: "notes",
    rarity: "Pospolity",
    knowledgeBonus: 1,
    taskTimeBonus: 2,
    taskCategory: "Projekt",
  },
  {
    slug: "freshman-backpack",
    name: "Plecak pierwszoroczniaka",
    description: "Miesci laptop, zeszyt i rosnaca swiadomosc konsekwencji wyboru studiow.",
    category: "Plecak",
    slot: "bag",
    rarity: "Pospolity",
    maximumEnergyBonus: 5,
  },
  {
    slug: "older-year-notes",
    name: "Notatki od starszego rocznika",
    description: "Nie wiadomo, kto pisal, ale osoba ta widziala rzeczy.",
    category: "Notatki",
    slot: "notes",
    rarity: "Niepospolity",
    knowledgeBonus: 2,
  },
  {
    slug: "library-card",
    name: "Karta biblioteczna",
    description: "Otwiera drzwi do wiedzy i naliczania kar za przetrzymanie.",
    category: "Akcesorium",
    slot: "accessory",
    rarity: "Pospolity",
    reputationBonus: 1,
  },
  {
    slug: "mystery-pendrive",
    name: "Pendrive bez opisu",
    description: "Zawiera projekt, wirusa albo zdjecia z juwenaliow. Ryzyko akademickie.",
    category: "Akcesorium",
    slot: "accessory",
    rarity: "Niepospolity",
    taskTimeBonus: 4,
    taskCategory: "Projekt",
  },
  {
    slug: "presentation-suit",
    name: "Garnitur na prezentacje",
    description: "Dodaje +1 do powagi i +3 do pytan z sali.",
    category: "Strój",
    slot: "outfit",
    rarity: "Niepospolity",
    reputationBonus: 2,
    moneyRewardBonus: 2,
    taskCategory: "Projekt",
  },
  {
    slug: "thermal-mug",
    name: "Kubek termiczny",
    description: "Utrzymuje temperature kawy dluzej niz Twoj plan nauki.",
    category: "Akcesorium",
    slot: "accessory",
    rarity: "Pospolity",
    energyRegenBonus: 15,
  },
  {
    slug: "vending-machine-coffee",
    name: "Kawa z automatu",
    description: "Smakuje jak decyzja podjeta o 7:42, ale dziala.",
    category: "Przedmiot jednorazowy",
    slot: null,
    rarity: "Pospolity",
    energyRestore: 18,
    stressReduce: 2,
    isConsumable: true,
  },
  {
    slug: "pre-exam-energy-drink",
    name: "Energetyk przed egzaminem",
    description: "Serce robi sprint, a notatki nagle wydaja sie czytelne.",
    category: "Przedmiot jednorazowy",
    slot: null,
    rarity: "Niepospolity",
    energyRestore: 28,
    stressReduce: 0,
    isConsumable: true,
  },
];

const shopOffers = [
  { itemSlug: "vending-machine-coffee", price: 10 },
  { itemSlug: "pre-exam-energy-drink", price: 20 },
  { itemSlug: "scientific-calculator", price: 80 },
  { itemSlug: "freshman-backpack", price: 120 },
  { itemSlug: "thermal-mug", price: 150 },
  { itemSlug: "old-cousin-laptop", price: 500 },
];

const taskItemDrops = [
  {
    taskSlug: "survive-8am-lecture",
    itemSlug: "vending-machine-coffee",
    dropChanceBasisPoints: 2000,
  },
  {
    taskSlug: "get-notes-from-older-year",
    itemSlug: "older-year-notes",
    dropChanceBasisPoints: 800,
  },
  {
    taskSlug: "defeat-campus-printer",
    itemSlug: "mystery-pendrive",
    dropChanceBasisPoints: 800,
  },
  {
    taskSlug: "last-minute-presentation",
    itemSlug: "presentation-suit",
    dropChanceBasisPoints: 300,
  },
  {
    taskSlug: "help-conference",
    itemSlug: "library-card",
    dropChanceBasisPoints: 1000,
  },
  {
    taskSlug: "help-conference",
    itemSlug: "thermal-mug",
    dropChanceBasisPoints: 800,
  },
];

const sampleCommissions = [
  {
    title: "Potrzebuje notatek z ostatniego wykladu",
    description:
      "Najlepiej takich, gdzie wiadomo, co bylo wazne, a co bylo tylko dygresja prowadzacego.",
    category: "Notatki",
    minimumLevel: 1,
    moneyReward: 18,
  },
  {
    title: "Szukam osoby do projektu grupowego",
    description:
      "Projekt istnieje glownie w teorii, ale repozytorium juz zalozone. To chyba postep.",
    category: "Projekt",
    minimumLevel: 2,
    moneyReward: 35,
  },
  {
    title: "Pomoc przy przygotowaniu prezentacji",
    description: "Mam temat, stres i trzy slajdy. Potrzebuje reszty oraz kogos, kto zna fonty.",
    category: "Prezentacja",
    minimumLevel: 1,
    moneyReward: 24,
  },
  {
    title: "Potrzebuje grafiki do wydarzenia",
    description: "Ma byc akademicko, mlodziezowo i bez clipartu z 2004 roku.",
    category: "Grafika",
    minimumLevel: 1,
    moneyReward: 28,
  },
  {
    title: "Pomoc w zebraniu ankiet",
    description: "Trzeba zaczepic ludzi na kampusie i udawac, ze to zajmie tylko minute.",
    category: "Ankieta",
    minimumLevel: 1,
    moneyReward: 20,
  },
  {
    title: "Zastepstwo przy organizacji konferencji",
    description: "W pakiecie identyfikatory, krzesla i pytanie, gdzie jest przedluzacz.",
    category: "Konferencja",
    minimumLevel: 2,
    moneyReward: 42,
  },
  {
    title: "Poszukiwany informatyk do naprawy prezentacji",
    description: "Animacje przejsc wygraly z rozsadkiem. Trzeba odzyskac plik i honor.",
    category: "Techniczne",
    minimumLevel: 2,
    moneyReward: 40,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail) {
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingAdmin) {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { role: "admin", isBlocked: false },
      });
    } else if (adminPassword && adminPassword.length >= 8) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashPassword(adminPassword),
          role: "admin",
        },
      });
    }
  }

  for (const program of studyPrograms) {
    await prisma.studyProgram.upsert({
      where: { slug: program.slug },
      create: program,
      update: program,
    });
  }

  for (const task of universityTasks) {
    await prisma.universityTask.upsert({
      where: { slug: task.slug },
      create: task,
      update: task,
    });
  }

  for (const item of itemDefinitions) {
    await prisma.itemDefinition.upsert({
      where: { slug: item.slug },
      create: item,
      update: item,
    });
  }

  for (const offer of shopOffers) {
    const item = await prisma.itemDefinition.findUnique({
      where: { slug: offer.itemSlug },
      select: { id: true },
    });

    if (item) {
      await prisma.shopOffer.upsert({
        where: { itemId: item.id },
        create: {
          itemId: item.id,
          price: offer.price,
        },
        update: {
          price: offer.price,
          isActive: true,
        },
      });
    }
  }

  for (const drop of taskItemDrops) {
    const [task, item] = await Promise.all([
      prisma.universityTask.findUnique({
        where: { slug: drop.taskSlug },
        select: { id: true },
      }),
      prisma.itemDefinition.findUnique({
        where: { slug: drop.itemSlug },
        select: { id: true },
      }),
    ]);

    if (task && item) {
      await prisma.taskItemDrop.upsert({
        where: {
          universityTaskId_itemId: {
            universityTaskId: task.id,
            itemId: item.id,
          },
        },
        create: {
          universityTaskId: task.id,
          itemId: item.id,
          dropChanceBasisPoints: drop.dropChanceBasisPoints,
        },
        update: {
          dropChanceBasisPoints: drop.dropChanceBasisPoints,
          isActive: true,
        },
      });
    }
  }

  const firstStudent = await prisma.student.findFirst({ select: { id: true } });

  if (firstStudent) {
    const commissionDeadline = new Date();
    commissionDeadline.setDate(commissionDeadline.getDate() + 7);

    for (const commission of sampleCommissions) {
      const existing = await prisma.studentCommission.findFirst({
        where: {
          creatorId: firstStudent.id,
          title: commission.title,
        },
        select: { id: true },
      });

      if (!existing) {
        await prisma.studentCommission.create({
          data: {
            creatorId: firstStudent.id,
            title: commission.title,
            description: commission.description,
            category: commission.category,
            minimumLevel: commission.minimumLevel,
            deadlineAt: commissionDeadline,
            moneyReward: commission.moneyReward,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

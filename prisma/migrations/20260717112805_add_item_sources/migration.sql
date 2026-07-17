-- CreateTable
CREATE TABLE "TaskItemDrop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityTaskId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "dropChanceBasisPoints" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskItemDrop_universityTaskId_fkey" FOREIGN KEY ("universityTaskId") REFERENCES "UniversityTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskItemDrop_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShopOffer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentItemLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "itemId" TEXT,
    "source" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentItemLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentItemLog_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "studyProgramId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "knowledge" INTEGER NOT NULL DEFAULT 10,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "maximumEnergy" INTEGER NOT NULL DEFAULT 100,
    "lastEnergyUpdateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 100,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "starterItemsGranted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "StudyProgram" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("createdAt", "displayName", "energy", "experience", "id", "knowledge", "lastEnergyUpdateAt", "level", "maximumEnergy", "money", "reputation", "semester", "stress", "studyProgramId", "updatedAt", "userId") SELECT "createdAt", "displayName", "energy", "experience", "id", "knowledge", "lastEnergyUpdateAt", "level", "maximumEnergy", "money", "reputation", "semester", "stress", "studyProgramId", "updatedAt", "userId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE INDEX "Student_studyProgramId_idx" ON "Student"("studyProgramId");
CREATE INDEX "Student_level_idx" ON "Student"("level");
CREATE INDEX "Student_knowledge_idx" ON "Student"("knowledge");
CREATE INDEX "Student_reputation_idx" ON "Student"("reputation");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TaskItemDrop_universityTaskId_isActive_idx" ON "TaskItemDrop"("universityTaskId", "isActive");

-- CreateIndex
CREATE INDEX "TaskItemDrop_itemId_idx" ON "TaskItemDrop"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskItemDrop_universityTaskId_itemId_key" ON "TaskItemDrop"("universityTaskId", "itemId");

-- CreateIndex
CREATE INDEX "ShopOffer_isActive_idx" ON "ShopOffer"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ShopOffer_itemId_key" ON "ShopOffer"("itemId");

-- CreateIndex
CREATE INDEX "StudentItemLog_studentId_createdAt_idx" ON "StudentItemLog"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudentItemLog_source_idx" ON "StudentItemLog"("source");

-- CreateIndex
CREATE INDEX "StudentItemLog_itemId_idx" ON "StudentItemLog"("itemId");

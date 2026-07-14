-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "universityTaskId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishesAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "experienceReward" INTEGER NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "reputationReward" INTEGER NOT NULL,
    "knowledgeReward" INTEGER NOT NULL DEFAULT 0,
    "stressChange" INTEGER NOT NULL DEFAULT 0,
    "energyCost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentTask_universityTaskId_fkey" FOREIGN KEY ("universityTaskId") REFERENCES "UniversityTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentTask" ("completedAt", "createdAt", "energyCost", "experienceReward", "finishesAt", "id", "moneyReward", "reputationReward", "startedAt", "status", "studentId", "universityTaskId", "updatedAt") SELECT "completedAt", "createdAt", "energyCost", "experienceReward", "finishesAt", "id", "moneyReward", "reputationReward", "startedAt", "status", "studentId", "universityTaskId", "updatedAt" FROM "StudentTask";
DROP TABLE "StudentTask";
ALTER TABLE "new_StudentTask" RENAME TO "StudentTask";
CREATE INDEX "StudentTask_studentId_status_idx" ON "StudentTask"("studentId", "status");
CREATE INDEX "StudentTask_universityTaskId_idx" ON "StudentTask"("universityTaskId");
CREATE TABLE "new_UniversityTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Dziekanat',
    "minimumLevel" INTEGER NOT NULL DEFAULT 1,
    "energyCost" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "experienceReward" INTEGER NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "reputationReward" INTEGER NOT NULL,
    "knowledgeReward" INTEGER NOT NULL DEFAULT 0,
    "stressChange" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UniversityTask" ("createdAt", "description", "durationSeconds", "energyCost", "experienceReward", "id", "isActive", "minimumLevel", "moneyReward", "reputationReward", "slug", "stressChange", "title", "updatedAt") SELECT "createdAt", "description", "durationSeconds", "energyCost", "experienceReward", "id", "isActive", "minimumLevel", "moneyReward", "reputationReward", "slug", "stressChange", "title", "updatedAt" FROM "UniversityTask";
DROP TABLE "UniversityTask";
ALTER TABLE "new_UniversityTask" RENAME TO "UniversityTask";
CREATE UNIQUE INDEX "UniversityTask_slug_key" ON "UniversityTask"("slug");
CREATE INDEX "UniversityTask_minimumLevel_idx" ON "UniversityTask"("minimumLevel");
CREATE INDEX "UniversityTask_isActive_idx" ON "UniversityTask"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

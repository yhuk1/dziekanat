-- CreateTable
CREATE TABLE "StudentRewardLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "studentTaskId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "levelBefore" INTEGER NOT NULL,
    "levelAfter" INTEGER NOT NULL,
    "experienceChange" INTEGER NOT NULL,
    "moneyChange" INTEGER NOT NULL,
    "reputationChange" INTEGER NOT NULL,
    "knowledgeChange" INTEGER NOT NULL,
    "stressChange" INTEGER NOT NULL,
    "energyChange" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentRewardLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "StudyProgram" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("createdAt", "displayName", "energy", "experience", "id", "knowledge", "level", "maximumEnergy", "money", "reputation", "semester", "stress", "studyProgramId", "updatedAt", "userId") SELECT "createdAt", "displayName", "energy", "experience", "id", "knowledge", "level", "maximumEnergy", "money", "reputation", "semester", "stress", "studyProgramId", "updatedAt", "userId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE INDEX "Student_studyProgramId_idx" ON "Student"("studyProgramId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StudentRewardLog_studentId_createdAt_idx" ON "StudentRewardLog"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudentRewardLog_studentTaskId_idx" ON "StudentRewardLog"("studentTaskId");

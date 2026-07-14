-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "studyProgramId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "knowledge" INTEGER NOT NULL DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "maximumEnergy" INTEGER NOT NULL DEFAULT 100,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 50,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "StudyProgram" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bonusLabel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UniversityTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minimumLevel" INTEGER NOT NULL DEFAULT 1,
    "energyCost" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "experienceReward" INTEGER NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "reputationReward" INTEGER NOT NULL,
    "stressChange" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudentTask" (
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
    "energyCost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentTask_universityTaskId_fkey" FOREIGN KEY ("universityTaskId") REFERENCES "UniversityTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Student_studyProgramId_idx" ON "Student"("studyProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgram_slug_key" ON "StudyProgram"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgram_name_key" ON "StudyProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityTask_slug_key" ON "UniversityTask"("slug");

-- CreateIndex
CREATE INDEX "UniversityTask_minimumLevel_idx" ON "UniversityTask"("minimumLevel");

-- CreateIndex
CREATE INDEX "UniversityTask_isActive_idx" ON "UniversityTask"("isActive");

-- CreateIndex
CREATE INDEX "StudentTask_studentId_status_idx" ON "StudentTask"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentTask_universityTaskId_idx" ON "StudentTask"("universityTaskId");

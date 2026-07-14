-- CreateTable
CREATE TABLE "StudentExamAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "requiredScore" INTEGER NOT NULL,
    "narrative" TEXT NOT NULL,
    "knowledgeAtAttempt" INTEGER NOT NULL,
    "levelAtAttempt" INTEGER NOT NULL,
    "stressAtAttempt" INTEGER NOT NULL,
    "nextAttemptAllowedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentExamAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudentExamAttempt_studentId_semester_idx" ON "StudentExamAttempt"("studentId", "semester");

-- CreateIndex
CREATE INDEX "StudentExamAttempt_studentId_status_idx" ON "StudentExamAttempt"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentExamAttempt_nextAttemptAllowedAt_idx" ON "StudentExamAttempt"("nextAttemptAllowedAt");

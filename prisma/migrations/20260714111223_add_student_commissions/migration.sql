-- CreateTable
CREATE TABLE "StudentCommission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "contractorId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minimumLevel" INTEGER NOT NULL,
    "deadlineAt" DATETIME NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "acceptedAt" DATETIME,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentCommission_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentCommission_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudentCommission_status_idx" ON "StudentCommission"("status");

-- CreateIndex
CREATE INDEX "StudentCommission_creatorId_status_idx" ON "StudentCommission"("creatorId", "status");

-- CreateIndex
CREATE INDEX "StudentCommission_contractorId_status_idx" ON "StudentCommission"("contractorId", "status");

-- CreateIndex
CREATE INDEX "StudentCommission_deadlineAt_idx" ON "StudentCommission"("deadlineAt");

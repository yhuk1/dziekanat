-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'player',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studyProgramId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "knowledge" INTEGER NOT NULL DEFAULT 10,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "maximumEnergy" INTEGER NOT NULL DEFAULT 100,
    "lastEnergyUpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 100,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudyProgram" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bonusLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UniversityTask" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentTask" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "universityTaskId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "activeSlot" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishesAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "experienceReward" INTEGER NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "reputationReward" INTEGER NOT NULL,
    "knowledgeReward" INTEGER NOT NULL DEFAULT 0,
    "stressChange" INTEGER NOT NULL DEFAULT 0,
    "energyCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentRewardLog" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentRewardLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemDefinition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slot" TEXT,
    "rarity" TEXT NOT NULL,
    "knowledgeBonus" INTEGER NOT NULL DEFAULT 0,
    "maximumEnergyBonus" INTEGER NOT NULL DEFAULT 0,
    "energyRegenBonus" INTEGER NOT NULL DEFAULT 0,
    "reputationBonus" INTEGER NOT NULL DEFAULT 0,
    "moneyRewardBonus" INTEGER NOT NULL DEFAULT 0,
    "taskTimeBonus" INTEGER NOT NULL DEFAULT 0,
    "taskCategory" TEXT,
    "energyRestore" INTEGER NOT NULL DEFAULT 0,
    "stressReduce" INTEGER NOT NULL DEFAULT 0,
    "isConsumable" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentInventoryItem" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentInventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentEquipment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "equippedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentCommission" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "contractorId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minimumLevel" INTEGER NOT NULL,
    "deadlineAt" TIMESTAMP(3) NOT NULL,
    "moneyReward" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "acceptedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCommission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentExamAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "requiredScore" INTEGER NOT NULL,
    "narrative" TEXT NOT NULL,
    "knowledgeAtAttempt" INTEGER NOT NULL,
    "levelAtAttempt" INTEGER NOT NULL,
    "stressAtAttempt" INTEGER NOT NULL,
    "nextAttemptAllowedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "details" TEXT NOT NULL,
    "economyChange" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_isBlocked_idx" ON "public"."User"("isBlocked");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "public"."Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "public"."Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "public"."Student"("userId");

-- CreateIndex
CREATE INDEX "Student_studyProgramId_idx" ON "public"."Student"("studyProgramId");

-- CreateIndex
CREATE INDEX "Student_level_idx" ON "public"."Student"("level");

-- CreateIndex
CREATE INDEX "Student_knowledge_idx" ON "public"."Student"("knowledge");

-- CreateIndex
CREATE INDEX "Student_reputation_idx" ON "public"."Student"("reputation");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgram_slug_key" ON "public"."StudyProgram"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgram_name_key" ON "public"."StudyProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityTask_slug_key" ON "public"."UniversityTask"("slug");

-- CreateIndex
CREATE INDEX "UniversityTask_minimumLevel_idx" ON "public"."UniversityTask"("minimumLevel");

-- CreateIndex
CREATE INDEX "UniversityTask_isActive_idx" ON "public"."UniversityTask"("isActive");

-- CreateIndex
CREATE INDEX "StudentTask_studentId_status_idx" ON "public"."StudentTask"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentTask_status_studentId_idx" ON "public"."StudentTask"("status", "studentId");

-- CreateIndex
CREATE INDEX "StudentTask_universityTaskId_idx" ON "public"."StudentTask"("universityTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTask_studentId_activeSlot_key" ON "public"."StudentTask"("studentId", "activeSlot");

-- CreateIndex
CREATE INDEX "StudentRewardLog_studentId_createdAt_idx" ON "public"."StudentRewardLog"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudentRewardLog_studentTaskId_idx" ON "public"."StudentRewardLog"("studentTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemDefinition_slug_key" ON "public"."ItemDefinition"("slug");

-- CreateIndex
CREATE INDEX "ItemDefinition_category_idx" ON "public"."ItemDefinition"("category");

-- CreateIndex
CREATE INDEX "ItemDefinition_slot_idx" ON "public"."ItemDefinition"("slot");

-- CreateIndex
CREATE INDEX "ItemDefinition_isActive_idx" ON "public"."ItemDefinition"("isActive");

-- CreateIndex
CREATE INDEX "StudentInventoryItem_studentId_idx" ON "public"."StudentInventoryItem"("studentId");

-- CreateIndex
CREATE INDEX "StudentInventoryItem_itemId_idx" ON "public"."StudentInventoryItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentInventoryItem_studentId_itemId_key" ON "public"."StudentInventoryItem"("studentId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEquipment_inventoryItemId_key" ON "public"."StudentEquipment"("inventoryItemId");

-- CreateIndex
CREATE INDEX "StudentEquipment_studentId_idx" ON "public"."StudentEquipment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEquipment_studentId_slot_key" ON "public"."StudentEquipment"("studentId", "slot");

-- CreateIndex
CREATE INDEX "StudentCommission_status_idx" ON "public"."StudentCommission"("status");

-- CreateIndex
CREATE INDEX "StudentCommission_creatorId_status_idx" ON "public"."StudentCommission"("creatorId", "status");

-- CreateIndex
CREATE INDEX "StudentCommission_contractorId_status_idx" ON "public"."StudentCommission"("contractorId", "status");

-- CreateIndex
CREATE INDEX "StudentCommission_status_contractorId_idx" ON "public"."StudentCommission"("status", "contractorId");

-- CreateIndex
CREATE INDEX "StudentCommission_deadlineAt_idx" ON "public"."StudentCommission"("deadlineAt");

-- CreateIndex
CREATE INDEX "StudentExamAttempt_studentId_semester_idx" ON "public"."StudentExamAttempt"("studentId", "semester");

-- CreateIndex
CREATE INDEX "StudentExamAttempt_studentId_status_idx" ON "public"."StudentExamAttempt"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentExamAttempt_nextAttemptAllowedAt_idx" ON "public"."StudentExamAttempt"("nextAttemptAllowedAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_createdAt_idx" ON "public"."AdminAuditLog"("adminUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "public"."AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetType_idx" ON "public"."AdminAuditLog"("targetType");

-- CreateIndex
CREATE INDEX "AdminAuditLog_economyChange_idx" ON "public"."AdminAuditLog"("economyChange");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "public"."StudyProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTask" ADD CONSTRAINT "StudentTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTask" ADD CONSTRAINT "StudentTask_universityTaskId_fkey" FOREIGN KEY ("universityTaskId") REFERENCES "public"."UniversityTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentRewardLog" ADD CONSTRAINT "StudentRewardLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentInventoryItem" ADD CONSTRAINT "StudentInventoryItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentInventoryItem" ADD CONSTRAINT "StudentInventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."ItemDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentEquipment" ADD CONSTRAINT "StudentEquipment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentEquipment" ADD CONSTRAINT "StudentEquipment_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."StudentInventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentCommission" ADD CONSTRAINT "StudentCommission_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentCommission" ADD CONSTRAINT "StudentCommission_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentExamAttempt" ADD CONSTRAINT "StudentExamAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


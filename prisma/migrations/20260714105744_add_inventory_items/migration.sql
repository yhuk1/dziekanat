-- CreateTable
CREATE TABLE "ItemDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudentInventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentInventoryItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentInventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "equippedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentEquipment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentEquipment_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "StudentInventoryItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemDefinition_slug_key" ON "ItemDefinition"("slug");

-- CreateIndex
CREATE INDEX "ItemDefinition_category_idx" ON "ItemDefinition"("category");

-- CreateIndex
CREATE INDEX "ItemDefinition_slot_idx" ON "ItemDefinition"("slot");

-- CreateIndex
CREATE INDEX "ItemDefinition_isActive_idx" ON "ItemDefinition"("isActive");

-- CreateIndex
CREATE INDEX "StudentInventoryItem_studentId_idx" ON "StudentInventoryItem"("studentId");

-- CreateIndex
CREATE INDEX "StudentInventoryItem_itemId_idx" ON "StudentInventoryItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentInventoryItem_studentId_itemId_key" ON "StudentInventoryItem"("studentId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEquipment_inventoryItemId_key" ON "StudentEquipment"("inventoryItemId");

-- CreateIndex
CREATE INDEX "StudentEquipment_studentId_idx" ON "StudentEquipment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEquipment_studentId_slot_key" ON "StudentEquipment"("studentId", "slot");

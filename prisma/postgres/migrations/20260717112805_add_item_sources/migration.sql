-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "starterItemsGranted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."TaskItemDrop" (
    "id" TEXT NOT NULL,
    "universityTaskId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "dropChanceBasisPoints" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskItemDrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShopOffer" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentItemLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "itemId" TEXT,
    "source" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentItemLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskItemDrop_universityTaskId_isActive_idx" ON "public"."TaskItemDrop"("universityTaskId", "isActive");

-- CreateIndex
CREATE INDEX "TaskItemDrop_itemId_idx" ON "public"."TaskItemDrop"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskItemDrop_universityTaskId_itemId_key" ON "public"."TaskItemDrop"("universityTaskId", "itemId");

-- CreateIndex
CREATE INDEX "ShopOffer_isActive_idx" ON "public"."ShopOffer"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ShopOffer_itemId_key" ON "public"."ShopOffer"("itemId");

-- CreateIndex
CREATE INDEX "StudentItemLog_studentId_createdAt_idx" ON "public"."StudentItemLog"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudentItemLog_source_idx" ON "public"."StudentItemLog"("source");

-- CreateIndex
CREATE INDEX "StudentItemLog_itemId_idx" ON "public"."StudentItemLog"("itemId");

-- AddForeignKey
ALTER TABLE "public"."TaskItemDrop" ADD CONSTRAINT "TaskItemDrop_universityTaskId_fkey" FOREIGN KEY ("universityTaskId") REFERENCES "public"."UniversityTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskItemDrop" ADD CONSTRAINT "TaskItemDrop_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."ItemDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShopOffer" ADD CONSTRAINT "ShopOffer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."ItemDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentItemLog" ADD CONSTRAINT "StudentItemLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentItemLog" ADD CONSTRAINT "StudentItemLog_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."ItemDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

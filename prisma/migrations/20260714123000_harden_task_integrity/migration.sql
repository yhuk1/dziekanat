-- AlterTable
ALTER TABLE "StudentTask" ADD COLUMN "activeSlot" TEXT;

-- Preserve the active-task lock for existing in-progress tasks without failing if a
-- development database already contains duplicate active rows for one student.
UPDATE "StudentTask"
SET "activeSlot" = 'active'
WHERE "status" = 'in_progress'
  AND "id" IN (
    SELECT "latest"."id"
    FROM "StudentTask" AS "latest"
    WHERE "latest"."studentId" = "StudentTask"."studentId"
      AND "latest"."status" = 'in_progress'
    ORDER BY "latest"."startedAt" DESC
    LIMIT 1
  );

-- CreateIndex
CREATE UNIQUE INDEX "StudentTask_studentId_activeSlot_key" ON "StudentTask"("studentId", "activeSlot");

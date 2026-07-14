-- CreateIndex
CREATE INDEX "Student_level_idx" ON "Student"("level");

-- CreateIndex
CREATE INDEX "Student_knowledge_idx" ON "Student"("knowledge");

-- CreateIndex
CREATE INDEX "Student_reputation_idx" ON "Student"("reputation");

-- CreateIndex
CREATE INDEX "StudentCommission_status_contractorId_idx" ON "StudentCommission"("status", "contractorId");

-- CreateIndex
CREATE INDEX "StudentTask_status_studentId_idx" ON "StudentTask"("status", "studentId");

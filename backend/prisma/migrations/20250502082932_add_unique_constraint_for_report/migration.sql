/*
  Warnings:

  - A unique constraint covering the columns `[user_id,review_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_user_id_review_id_key" ON "Report"("user_id", "review_id");

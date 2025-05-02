/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'bla';

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_user_id_key" ON "Feedback"("user_id");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

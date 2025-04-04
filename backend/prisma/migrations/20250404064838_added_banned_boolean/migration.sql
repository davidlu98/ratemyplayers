/*
  Warnings:

  - You are about to alter the column `feedback` on the `Feedback` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `reason` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `comment` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "feedback" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "comment" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;

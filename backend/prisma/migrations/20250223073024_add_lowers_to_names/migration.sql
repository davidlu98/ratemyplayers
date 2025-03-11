/*
  Warnings:

  - A unique constraint covering the columns `[current_name_lower]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `current_name_lower` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_lower` to the `PreviousName` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "current_name_lower" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PreviousName" ADD COLUMN     "name_lower" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_current_name_lower_key" ON "Player"("current_name_lower");

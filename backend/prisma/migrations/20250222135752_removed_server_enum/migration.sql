/*
  Warnings:

  - Changed the type of `server` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "server",
ADD COLUMN     "server" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Server";

/*
  Warnings:

  - A unique constraint covering the columns `[user_id,player_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_user_id_player_id_key" ON "Review"("user_id", "player_id");

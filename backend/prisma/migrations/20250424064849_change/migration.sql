-- DropForeignKey
ALTER TABLE "PreviousName" DROP CONSTRAINT "PreviousName_player_id_fkey";

-- AddForeignKey
ALTER TABLE "PreviousName" ADD CONSTRAINT "PreviousName_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

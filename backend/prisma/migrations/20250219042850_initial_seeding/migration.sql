-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NA', 'EU');

-- CreateEnum
CREATE TYPE "Server" AS ENUM ('SCANIA', 'BERA', 'AURORA', 'ELYSIUM', 'KRONOS', 'HYPERION', 'LUNA', 'SOLIS', 'BURNING');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "current_name" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "server" "Server" NOT NULL,
    "level" INTEGER NOT NULL,
    "archetype" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "job_class" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviousName" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviousName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_current_name_key" ON "Player"("current_name");

-- AddForeignKey
ALTER TABLE "PreviousName" ADD CONSTRAINT "PreviousName_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

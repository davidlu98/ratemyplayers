/*
  Warnings:

  - Added the required column `ip_address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ip_address" TEXT NOT NULL;

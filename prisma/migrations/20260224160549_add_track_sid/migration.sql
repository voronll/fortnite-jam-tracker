/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN "sid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Track_sid_key" ON "Track"("sid");

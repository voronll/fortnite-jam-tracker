-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "sid" TEXT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "bpm" INTEGER,
    "key" TEXT,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRotation" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "DailyRotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_sid_key" ON "Track"("sid");

-- CreateIndex
CREATE INDEX "DailyRotation_date_idx" ON "DailyRotation"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRotation_date_trackId_key" ON "DailyRotation"("date", "trackId");

-- AddForeignKey
ALTER TABLE "DailyRotation" ADD CONSTRAINT "DailyRotation_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

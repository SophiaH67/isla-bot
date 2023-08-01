/*
  Warnings:

  - A unique constraint covering the columns `[tracker,feedId]` on the table `RssFeedSeen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RssFeedSeen_tracker_feedId_key" ON "RssFeedSeen"("tracker", "feedId");

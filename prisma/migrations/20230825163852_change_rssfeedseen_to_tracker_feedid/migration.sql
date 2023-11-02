/*
  Warnings:

  - The primary key for the `RssFeedSeen` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "RssFeedSeen_tracker_feedId_key";

-- AlterTable
ALTER TABLE "RssFeedSeen" DROP CONSTRAINT "RssFeedSeen_pkey",
ADD CONSTRAINT "RssFeedSeen_pkey" PRIMARY KEY ("tracker", "feedId");

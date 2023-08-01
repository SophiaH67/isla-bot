/*
  Warnings:

  - You are about to drop the column `lastChecked` on the `RssFeed` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RssFeedSeen" (
    "tracker" TEXT NOT NULL PRIMARY KEY,
    "feedId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RssFeedSeen_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "RssFeed" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RssFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "syncChannel" TEXT NOT NULL,
    "syncFrontend" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RssFeed" ("createdAt", "id", "syncChannel", "syncFrontend", "url") SELECT "createdAt", "id", "syncChannel", "syncFrontend", "url" FROM "RssFeed";
DROP TABLE "RssFeed";
ALTER TABLE "new_RssFeed" RENAME TO "RssFeed";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

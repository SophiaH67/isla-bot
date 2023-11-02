-- DropForeignKey
ALTER TABLE "RssFeedSeen" DROP CONSTRAINT "RssFeedSeen_feedId_fkey";

-- AddForeignKey
ALTER TABLE "RssFeedSeen" ADD CONSTRAINT "RssFeedSeen_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "RssFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

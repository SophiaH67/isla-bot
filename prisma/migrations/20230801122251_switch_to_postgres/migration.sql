-- CreateTable
CREATE TABLE "RssFeed" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "syncChannel" TEXT NOT NULL,
    "syncFrontend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RssFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RssFeedSeen" (
    "tracker" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RssFeedSeen_pkey" PRIMARY KEY ("tracker")
);

-- CreateIndex
CREATE UNIQUE INDEX "RssFeedSeen_tracker_feedId_key" ON "RssFeedSeen"("tracker", "feedId");

-- AddForeignKey
ALTER TABLE "RssFeedSeen" ADD CONSTRAINT "RssFeedSeen_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "RssFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

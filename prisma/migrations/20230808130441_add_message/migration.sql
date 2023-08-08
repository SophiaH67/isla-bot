-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_channel_frontend_id_key" ON "Message"("channel", "frontend", "id");

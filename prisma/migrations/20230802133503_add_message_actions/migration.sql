-- CreateTable
CREATE TABLE "MessageAction" (
    "name" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAction_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_name_channel_frontend_key" ON "MessageAction"("name", "channel", "frontend");

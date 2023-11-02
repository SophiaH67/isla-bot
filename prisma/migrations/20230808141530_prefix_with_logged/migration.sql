-- /*
--   Warnings:

--   - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

-- */
-- -- DropForeignKey
-- ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- -- DropTable
-- DROP TABLE "Message";

-- -- DropTable
-- DROP TABLE "User";

-- -- CreateTable
-- CREATE TABLE "LoggedMessage" (
--     "id" TEXT NOT NULL,
--     "authorId" TEXT NOT NULL,
--     "channel" TEXT NOT NULL,
--     "frontend" TEXT NOT NULL,
--     "content" TEXT NOT NULL,
--     "updatedAt" TIMESTAMP(3) NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT "LoggedMessage_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "LoggedUser" (
--     "id" TEXT NOT NULL,
--     "name" TEXT NOT NULL,
--     "frontend" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "LoggedUser_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateIndex
-- CREATE UNIQUE INDEX "LoggedMessage_channel_frontend_id_key" ON "LoggedMessage"("channel", "frontend", "id");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "LoggedUser_id_frontend_key" ON "LoggedUser"("id", "frontend");

-- -- AddForeignKey
-- ALTER TABLE "LoggedMessage" ADD CONSTRAINT "LoggedMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "LoggedUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

BEGIN;

ALTER TABLE "Message" RENAME TO "LoggedMessage";

ALTER TABLE "User" RENAME TO "LoggedUser";

ALTER INDEX "Message_channel_frontend_id_key" RENAME TO "LoggedMessage_channel_frontend_id_key";

ALTER INDEX "User_id_frontend_key" RENAME TO "LoggedUser_id_frontend_key";

-- AlterTable
ALTER TABLE "LoggedMessage" RENAME CONSTRAINT "Message_pkey" TO "LoggedMessage_pkey";

-- AlterTable
ALTER TABLE "LoggedUser" RENAME CONSTRAINT "User_pkey" TO "LoggedUser_pkey";

-- RenameForeignKey
ALTER TABLE "LoggedMessage" RENAME CONSTRAINT "Message_authorId_fkey" TO "LoggedMessage_authorId_fkey";

COMMIT;
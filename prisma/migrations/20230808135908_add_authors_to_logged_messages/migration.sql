/*
  Warnings:

  - Added the required column `authorId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Delete all messages, because the new column is required and has no default value
DELETE FROM "Message";

ALTER TABLE "Message" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_frontend_key" ON "User"("id", "frontend");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

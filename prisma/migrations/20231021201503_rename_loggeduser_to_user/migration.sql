-- Scratch that, just rename the table
ALTER TABLE "LoggedUser"
  RENAME TO "User";
-- AlterTable
ALTER TABLE "User"
  RENAME CONSTRAINT "LoggedUser_pkey" TO "User_pkey";
-- RenameIndex
ALTER INDEX "LoggedUser_id_frontend_key"
RENAME TO "User_id_frontend_key";
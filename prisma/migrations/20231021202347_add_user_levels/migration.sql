-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('PILOT', 'COPILOT', 'GUEST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" "UserLevel" NOT NULL DEFAULT 'GUEST';

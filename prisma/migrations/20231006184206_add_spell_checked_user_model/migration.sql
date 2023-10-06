-- CreateTable
CREATE TABLE "SpellCheckedUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpellCheckedUser_pkey" PRIMARY KEY ("id")
);

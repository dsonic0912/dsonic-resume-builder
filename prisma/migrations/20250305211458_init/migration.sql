-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "location" TEXT,
    "about" TEXT,
    "summary" TEXT,
    "avatarUrl" TEXT,
    "personalWebsiteUrl" TEXT,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

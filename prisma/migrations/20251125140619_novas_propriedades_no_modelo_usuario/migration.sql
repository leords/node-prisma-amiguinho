-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "resetExpires" DATETIME;
ALTER TABLE "usuarios" ADD COLUMN "resetToken" TEXT;

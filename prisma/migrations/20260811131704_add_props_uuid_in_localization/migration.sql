/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Localizacao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Localizacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Localizacao" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Localizacao_uuid_key" ON "Localizacao"("uuid");

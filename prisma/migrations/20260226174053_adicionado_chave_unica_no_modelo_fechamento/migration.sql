/*
  Warnings:

  - A unique constraint covering the columns `[vendedor,data]` on the table `Fechamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fechamento_vendedor_data_key" ON "Fechamento"("vendedor", "data");

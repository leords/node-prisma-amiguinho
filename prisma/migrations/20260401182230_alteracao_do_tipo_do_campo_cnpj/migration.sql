/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

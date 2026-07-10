/*
  Warnings:

  - You are about to drop the column `formaPagamentoId` on the `PedidoBalcao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PedidoBalcao" DROP CONSTRAINT "PedidoBalcao_formaPagamentoId_fkey";

-- AlterTable
ALTER TABLE "PedidoBalcao" DROP COLUMN "formaPagamentoId";

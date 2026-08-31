-- CreateTable
CREATE TABLE "MovimentacaoPagamentosEletronicos" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechamentoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MovimentacaoPagamentosEletronicos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovimentacaoPagamentosEletronicos" ADD CONSTRAINT "MovimentacaoPagamentosEletronicos_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

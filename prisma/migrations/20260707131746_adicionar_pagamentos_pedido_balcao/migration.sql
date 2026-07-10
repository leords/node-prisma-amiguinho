-- CreateTable
CREATE TABLE "PagamentoPedidoBalcao" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "formaPagamentoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PagamentoPedidoBalcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PagamentoPedidoBalcao_pedidoId_idx" ON "PagamentoPedidoBalcao"("pedidoId");

-- CreateIndex
CREATE INDEX "PagamentoPedidoBalcao_formaPagamentoId_idx" ON "PagamentoPedidoBalcao"("formaPagamentoId");

-- AddForeignKey
ALTER TABLE "PagamentoPedidoBalcao" ADD CONSTRAINT "PagamentoPedidoBalcao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoBalcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagamentoPedidoBalcao" ADD CONSTRAINT "PagamentoPedidoBalcao_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

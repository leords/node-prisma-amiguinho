-- CreateEnum
CREATE TYPE "NivelAcesso" AS ENUM ('ADMIN', 'VENDAS', 'BALCAO', 'DELIVERY', 'EXTERNO', 'USUARIO');

-- CreateEnum
CREATE TYPE "TipoMovimentacaoEstoque" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcesso" "NivelAcesso" NOT NULL DEFAULT 'USUARIO',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetExpires" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "embalagem" TEXT,
    "segmento" TEXT,
    "fornecedor" TEXT,
    "precoVenda" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "precoCompra" DECIMAL(65,30) DEFAULT 0.0,
    "peso" DECIMAL(65,30) DEFAULT 0.0,
    "lucro" DOUBLE PRECISION DEFAULT 0.0,
    "margem" DOUBLE PRECISION DEFAULT 0.0,
    "quantidade" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "precoUndVenda" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "estoque" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteDelivery" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "numero" INTEGER,
    "bairro" TEXT,
    "cidade" TEXT,
    "referencia" TEXT,

    CONSTRAINT "ClienteDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteExterno" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "cidade" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "vendedor" TEXT,
    "atendimento" TEXT,
    "frequencia" TEXT,

    CONSTRAINT "ClienteExterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoDelivery" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'delivery',
    "clienteId" INTEGER NOT NULL,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "PedidoDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoExterno" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'externo',
    "clienteId" INTEGER NOT NULL,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "PedidoExterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoBalcao" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'balcao',
    "cliente" TEXT,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'carregado',
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "nomeUsuario" TEXT NOT NULL,

    CONSTRAINT "PedidoBalcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoBalcao" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemPedidoBalcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoDelivery" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemPedidoDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoExterno" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemPedidoExterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formaPagamentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "formaPagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fechamento" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setor" TEXT NOT NULL,
    "vendedor" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "totalSistema" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInformado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diferenca" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dia" TEXT NOT NULL,

    CONSTRAINT "Fechamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoManual" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechamentoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MovimentacaoManual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estoque" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "tipo" "TipoMovimentacaoEstoque" NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" TEXT,
    "origemId" INTEGER,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOrdemCompra" (
    "id" SERIAL NOT NULL,
    "notaEntradaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemOrdemCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemCompra" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Realizada',
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrdemCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "vendedor" TEXT,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoDelivery_uuid_key" ON "PedidoDelivery"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoExterno_uuid_key" ON "PedidoExterno"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoBalcao_uuid_key" ON "PedidoBalcao"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Fechamento_vendedor_dia_setor_key" ON "Fechamento"("vendedor", "dia", "setor");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- AddForeignKey
ALTER TABLE "PedidoDelivery" ADD CONSTRAINT "PedidoDelivery_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDelivery" ADD CONSTRAINT "PedidoDelivery_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDelivery" ADD CONSTRAINT "PedidoDelivery_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoExterno" ADD CONSTRAINT "PedidoExterno_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteExterno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoExterno" ADD CONSTRAINT "PedidoExterno_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoExterno" ADD CONSTRAINT "PedidoExterno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoBalcao" ADD CONSTRAINT "PedidoBalcao_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoBalcao" ADD CONSTRAINT "PedidoBalcao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoBalcao" ADD CONSTRAINT "ItemPedidoBalcao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoBalcao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoBalcao" ADD CONSTRAINT "ItemPedidoBalcao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoDelivery" ADD CONSTRAINT "ItemPedidoDelivery_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoDelivery" ADD CONSTRAINT "ItemPedidoDelivery_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoExterno" ADD CONSTRAINT "ItemPedidoExterno_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoExterno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoExterno" ADD CONSTRAINT "ItemPedidoExterno_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoManual" ADD CONSTRAINT "MovimentacaoManual_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estoque" ADD CONSTRAINT "Estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estoque" ADD CONSTRAINT "Estoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrdemCompra" ADD CONSTRAINT "ItemOrdemCompra_notaEntradaId_fkey" FOREIGN KEY ("notaEntradaId") REFERENCES "OrdemCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrdemCompra" ADD CONSTRAINT "ItemOrdemCompra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemCompra" ADD CONSTRAINT "OrdemCompra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemCompra" ADD CONSTRAINT "OrdemCompra_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

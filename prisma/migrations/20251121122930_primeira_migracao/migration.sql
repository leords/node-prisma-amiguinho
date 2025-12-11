-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcesso" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "embalagem" TEXT,
    "segmento" TEXT,
    "fornecedor" TEXT,
    "precoVenda" DECIMAL NOT NULL DEFAULT 0.0,
    "precoCompra" DECIMAL DEFAULT 0.0,
    "peso" DECIMAL DEFAULT 0.0,
    "lucro" REAL DEFAULT 0.0,
    "margem" REAL DEFAULT 0.0,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "precoUndVenda" REAL NOT NULL DEFAULT 0.0,
    "estoque" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ClienteDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "numero" INTEGER,
    "bairro" TEXT,
    "cidade" TEXT,
    "referencia" TEXT
);

-- CreateTable
CREATE TABLE "ClienteExterno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "cidade" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "vendedor" TEXT,
    "atendimento" TEXT,
    "frequencia" TEXT
);

-- CreateTable
CREATE TABLE "PedidoDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "PedidoDelivery_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteDelivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoDelivery_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoDelivery_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PedidoExterno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "PedidoExterno_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteExterno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoExterno_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoExterno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PedidoBalcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "cliente" TEXT,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'carregado',
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    CONSTRAINT "PedidoBalcao_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoBalcao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedidoBalcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoBalcao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoBalcao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoBalcao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedidoDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoDelivery_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoDelivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoDelivery_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedidoExterno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoExterno_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoExterno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoExterno_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "formaPagamentos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
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

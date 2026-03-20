-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PedidoBalcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'balcao',
    "cliente" TEXT,
    "formaPagamentoId" INTEGER NOT NULL,
    "vendedor" TEXT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'carregado',
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "nomeUsuario" TEXT NOT NULL,
    CONSTRAINT "PedidoBalcao_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formaPagamentos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PedidoBalcao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PedidoBalcao" ("cliente", "data", "formaPagamentoId", "id", "nomeUsuario", "status", "total", "usuarioId", "uuid", "vendedor") SELECT "cliente", "data", "formaPagamentoId", "id", "nomeUsuario", "status", "total", "usuarioId", "uuid", "vendedor" FROM "PedidoBalcao";
DROP TABLE "PedidoBalcao";
ALTER TABLE "new_PedidoBalcao" RENAME TO "PedidoBalcao";
CREATE UNIQUE INDEX "PedidoBalcao_uuid_key" ON "PedidoBalcao"("uuid");
CREATE TABLE "new_PedidoDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'delivery',
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
INSERT INTO "new_PedidoDelivery" ("clienteId", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor") SELECT "clienteId", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor" FROM "PedidoDelivery";
DROP TABLE "PedidoDelivery";
ALTER TABLE "new_PedidoDelivery" RENAME TO "PedidoDelivery";
CREATE UNIQUE INDEX "PedidoDelivery_uuid_key" ON "PedidoDelivery"("uuid");
CREATE TABLE "new_PedidoExterno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'externo',
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
INSERT INTO "new_PedidoExterno" ("clienteId", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor") SELECT "clienteId", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor" FROM "PedidoExterno";
DROP TABLE "PedidoExterno";
ALTER TABLE "new_PedidoExterno" RENAME TO "PedidoExterno";
CREATE UNIQUE INDEX "PedidoExterno_uuid_key" ON "PedidoExterno"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

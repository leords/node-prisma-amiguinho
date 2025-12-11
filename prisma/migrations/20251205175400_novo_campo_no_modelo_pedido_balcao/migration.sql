/*
  Warnings:

  - Added the required column `nomeUsuario` to the `PedidoBalcao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PedidoBalcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
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
INSERT INTO "new_PedidoBalcao" ("cliente", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor") SELECT "cliente", "data", "formaPagamentoId", "id", "status", "total", "usuarioId", "uuid", "vendedor" FROM "PedidoBalcao";
DROP TABLE "PedidoBalcao";
ALTER TABLE "new_PedidoBalcao" RENAME TO "PedidoBalcao";
CREATE UNIQUE INDEX "PedidoBalcao_uuid_key" ON "PedidoBalcao"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

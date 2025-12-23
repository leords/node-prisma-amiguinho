/*
  Warnings:

  - You are about to drop the column `data` on the `ItemPedidoBalcao` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `ItemPedidoDelivery` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `ItemPedidoExterno` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemPedidoBalcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoBalcao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoBalcao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoBalcao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemPedidoBalcao" ("id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit") SELECT "id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit" FROM "ItemPedidoBalcao";
DROP TABLE "ItemPedidoBalcao";
ALTER TABLE "new_ItemPedidoBalcao" RENAME TO "ItemPedidoBalcao";
CREATE TABLE "new_ItemPedidoDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoDelivery_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoDelivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoDelivery_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemPedidoDelivery" ("id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit") SELECT "id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit" FROM "ItemPedidoDelivery";
DROP TABLE "ItemPedidoDelivery";
ALTER TABLE "new_ItemPedidoDelivery" RENAME TO "ItemPedidoDelivery";
CREATE TABLE "new_ItemPedidoExterno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemPedidoExterno_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoExterno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedidoExterno_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemPedidoExterno" ("id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit") SELECT "id", "pedidoId", "produtoId", "quantidade", "valorTotal", "valorUnit" FROM "ItemPedidoExterno";
DROP TABLE "ItemPedidoExterno";
ALTER TABLE "new_ItemPedidoExterno" RENAME TO "ItemPedidoExterno";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

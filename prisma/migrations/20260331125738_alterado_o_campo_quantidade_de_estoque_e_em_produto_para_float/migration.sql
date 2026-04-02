/*
  Warnings:

  - You are about to alter the column `quantidade` on the `Estoque` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `quantidade` on the `produtos` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" TEXT,
    "origemId" INTEGER,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Estoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Estoque" ("atualizado", "data", "id", "origem", "origemId", "produtoId", "quantidade", "tipo", "usuarioId") SELECT "atualizado", "data", "id", "origem", "origemId", "produtoId", "quantidade", "tipo", "usuarioId" FROM "Estoque";
DROP TABLE "Estoque";
ALTER TABLE "new_Estoque" RENAME TO "Estoque";
CREATE TABLE "new_produtos" (
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
    "quantidade" REAL NOT NULL DEFAULT 0.0,
    "precoUndVenda" DECIMAL NOT NULL DEFAULT 0.0,
    "estoque" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_produtos" ("embalagem", "estoque", "fornecedor", "id", "lucro", "margem", "nome", "peso", "precoCompra", "precoUndVenda", "precoVenda", "quantidade", "segmento") SELECT "embalagem", "estoque", "fornecedor", "id", "lucro", "margem", "nome", "peso", "precoCompra", "precoUndVenda", "precoVenda", "quantidade", "segmento" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

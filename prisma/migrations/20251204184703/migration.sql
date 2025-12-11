/*
  Warnings:

  - You are about to alter the column `precoUndVenda` on the `produtos` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "precoUndVenda" DECIMAL NOT NULL DEFAULT 0.0,
    "estoque" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_produtos" ("embalagem", "estoque", "fornecedor", "id", "lucro", "margem", "nome", "peso", "precoCompra", "precoUndVenda", "precoVenda", "quantidade", "segmento") SELECT "embalagem", "estoque", "fornecedor", "id", "lucro", "margem", "nome", "peso", "precoCompra", "precoUndVenda", "precoVenda", "quantidade", "segmento" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

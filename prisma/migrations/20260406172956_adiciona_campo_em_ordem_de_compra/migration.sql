/*
  Warnings:

  - Added the required column `total` to the `OrdemCompra` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdemCompra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Realizada',
    "total" REAL NOT NULL,
    CONSTRAINT "OrdemCompra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdemCompra_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdemCompra" ("data", "fornecedorId", "id", "status", "usuarioId") SELECT "data", "fornecedorId", "id", "status", "usuarioId" FROM "OrdemCompra";
DROP TABLE "OrdemCompra";
ALTER TABLE "new_OrdemCompra" RENAME TO "OrdemCompra";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

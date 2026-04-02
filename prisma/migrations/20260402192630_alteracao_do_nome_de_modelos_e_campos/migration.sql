/*
  Warnings:

  - You are about to drop the `ItemNotaEstoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotaEntradaEstoque` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ItemNotaEstoque";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotaEntradaEstoque";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ItemOrdemCompra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notaEntradaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemOrdemCompra_notaEntradaId_fkey" FOREIGN KEY ("notaEntradaId") REFERENCES "OrdemCompra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemOrdemCompra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrdemCompra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Realizada',
    CONSTRAINT "OrdemCompra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdemCompra_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

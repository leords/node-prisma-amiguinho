-- CreateTable
CREATE TABLE "ItemNotaEstoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notaEntradaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnit" REAL NOT NULL,
    "valorTotal" REAL NOT NULL,
    CONSTRAINT "ItemNotaEstoque_notaEntradaId_fkey" FOREIGN KEY ("notaEntradaId") REFERENCES "NotaEntradaEstoque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemNotaEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotaEntradaEstoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Realizada',
    CONSTRAINT "NotaEntradaEstoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NotaEntradaEstoque_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ativo'
);

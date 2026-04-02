-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fornecedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
);
INSERT INTO "new_Fornecedor" ("cnpj", "id", "nome", "status") SELECT "cnpj", "id", "nome", "status" FROM "Fornecedor";
DROP TABLE "Fornecedor";
ALTER TABLE "new_Fornecedor" RENAME TO "Fornecedor";
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

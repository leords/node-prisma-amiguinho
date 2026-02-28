/*
  Warnings:

  - Added the required column `dia` to the `Fechamento` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fechamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setor" TEXT NOT NULL,
    "vendedor" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "totalSistema" REAL NOT NULL DEFAULT 0,
    "totalInformado" REAL NOT NULL DEFAULT 0,
    "diferenca" REAL NOT NULL DEFAULT 0,
    "dia" TEXT NOT NULL
);
INSERT INTO "new_Fechamento" ("data", "diferenca", "id", "setor", "status", "totalInformado", "totalSistema", "vendedor") SELECT "data", "diferenca", "id", "setor", "status", "totalInformado", "totalSistema", "vendedor" FROM "Fechamento";
DROP TABLE "Fechamento";
ALTER TABLE "new_Fechamento" RENAME TO "Fechamento";
CREATE UNIQUE INDEX "Fechamento_vendedor_dia_setor_key" ON "Fechamento"("vendedor", "dia", "setor");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

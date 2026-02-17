/*
  Warnings:

  - You are about to drop the column `balcao` on the `Fechamento` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Fechamento` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MovimentacaoManual` table. All the data in the column will be lost.
  - Added the required column `setor` to the `Fechamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendedor` to the `Fechamento` table without a default value. This is not possible if the table is not empty.

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
    "totalSistema" REAL NOT NULL,
    "totalInformado" REAL NOT NULL,
    "diferenca" REAL NOT NULL
);
INSERT INTO "new_Fechamento" ("data", "diferenca", "id", "status", "totalInformado", "totalSistema") SELECT "data", "diferenca", "id", "status", "totalInformado", "totalSistema" FROM "Fechamento";
DROP TABLE "Fechamento";
ALTER TABLE "new_Fechamento" RENAME TO "Fechamento";
CREATE TABLE "new_MovimentacaoManual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechamentoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    CONSTRAINT "MovimentacaoManual_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MovimentacaoManual" ("descricao", "fechamentoId", "id", "tipo", "valor") SELECT "descricao", "fechamentoId", "id", "tipo", "valor" FROM "MovimentacaoManual";
DROP TABLE "MovimentacaoManual";
ALTER TABLE "new_MovimentacaoManual" RENAME TO "MovimentacaoManual";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

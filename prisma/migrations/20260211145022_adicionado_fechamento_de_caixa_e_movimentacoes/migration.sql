-- CreateTable
CREATE TABLE "Fechamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "balcao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalSistema" REAL NOT NULL,
    "totalInformado" REAL NOT NULL,
    "diferenca" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MovimentacaoManual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechamentoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MovimentacaoManual_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

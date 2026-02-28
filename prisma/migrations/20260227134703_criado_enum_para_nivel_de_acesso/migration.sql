/*
  Warnings:

  - You are about to drop the `niveisAcesso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "niveisAcesso";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcessoId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetExpires" DATETIME
);
INSERT INTO "new_usuarios" ("email", "id", "nivelAcessoId", "nome", "resetExpires", "resetToken", "senha", "status", "usuario") SELECT "email", "id", "nivelAcessoId", "nome", "resetExpires", "resetToken", "senha", "status", "usuario" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

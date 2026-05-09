/*
  Warnings:

  - You are about to drop the column `nivelAcessoId` on the `usuarios` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcesso" TEXT NOT NULL DEFAULT 'USUARIO',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetExpires" DATETIME
);
INSERT INTO "new_usuarios" ("email", "id", "nome", "resetExpires", "resetToken", "senha", "status", "usuario", "whatsapp") SELECT "email", "id", "nome", "resetExpires", "resetToken", "senha", "status", "usuario", "whatsapp" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

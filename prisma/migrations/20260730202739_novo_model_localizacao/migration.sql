-- AlterTable
ALTER TABLE "PedidoExterno" ALTER COLUMN "data" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Localizacao" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "precisao" DOUBLE PRECISION,
    "origem" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteExterno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

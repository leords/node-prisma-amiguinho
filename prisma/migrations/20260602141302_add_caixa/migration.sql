-- CreateTable
CREATE TABLE "Caixa" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Caixa_pkey" PRIMARY KEY ("id")
);

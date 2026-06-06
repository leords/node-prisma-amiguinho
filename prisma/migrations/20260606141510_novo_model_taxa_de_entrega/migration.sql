-- CreateTable
CREATE TABLE "TaxaEntregaDelivery" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "TaxaEntregaDelivery_pkey" PRIMARY KEY ("id")
);

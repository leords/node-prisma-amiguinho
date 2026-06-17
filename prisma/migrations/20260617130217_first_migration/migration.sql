-- AlterTable
ALTER TABLE "PedidoDelivery" ADD COLUMN     "dataCarregada" TIMESTAMP(3),
ADD COLUMN     "dataEntrega" TIMESTAMP(3),
ADD COLUMN     "latitudeEntrega" DOUBLE PRECISION,
ADD COLUMN     "longitudeEntrega" DOUBLE PRECISION,
ADD COLUMN     "precisaoGps" DOUBLE PRECISION;

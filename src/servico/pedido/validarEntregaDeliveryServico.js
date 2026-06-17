import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes";
import { AppError } from "../../error/appError";
import prismaCliente from "../../prisma/index.js"


class validarEntregaDeliveryServico {
    async executar(pedidoId, status, latitudeEntrega, longitudeEntrega, precisaoGps) {

        try {
            // Valida a existencia do pedido buscado no banco.
            const pedidoExistente = await prismaCliente.pedidoDelivery.findUnique({
                where: {
                    id
                }
            });

            // Validando.
            if(!pedidoExistente) {
                throw new AppError(
                    "Pedido não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "STATUS_NOT_FOUND"
                )
            }

            let data = {
                status
            }

            if(status === 'CARREGADO') {
                data.dataCarregada = new Date()
            }

            if(status === 'ENTREGUE') {
                if (longitudeEntrega == null || latitudeEntrega == null) {

                    throw new AppError(
                        "Coordenadas são obrigatórias para entrega",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "COORDINATE_REQUIRED"
                    );
                }
                
                data.dataEntrega = new Date()
                data.latitudeEntrega = latitudeEntrega
                data.longitudeEntrega = longitudeEntrega
                data.precisaoGps = precisaoGps
            }

        return await prismaCliente.pedidoDelivery.update({
            where: {
                id
            },
            data
          })


        } catch (error) {
            throw error
        }
    }
}

export { validarEntregaDeliveryServico }
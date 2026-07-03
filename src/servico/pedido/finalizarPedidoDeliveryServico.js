import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import { AppError } from "../../error/appError.js";
import prismaCliente from "../../prisma/index.js"

class finalizarPedidoDeliveryServico {
    async executar (uuid, status, lat, long, precisao, formaPagamentoId) {

        console.log('dados vindo do Controlador: ', uuid, status, lat, long, precisao, formaPagamentoId)

        try {
            const pedidoExistente = await prismaCliente.pedidoDelivery.findFirst({
                where: {
                    uuid: uuid
                }
            });

            if(!pedidoExistente) {
                throw new AppError(
                    'Pedido não encontrado',
                    HTTP_STATUS_CODES.NOT_FOUND,
                    'PEDIDO_NOT_FOUND'
                )
            }

            const pedidoAlterado = await prismaCliente.pedidoDelivery.update({
                where: {
                    uuid: uuid
                },
                data: {
                    status: status,
                    dataEntrega: new Date(),
                    latitudeEntrega: lat,
                    longitudeEntrega: long,
                    precisaoGps: precisao,
                    formaPagamentoId: formaPagamentoId
                }
            })

            return pedidoAlterado


        } catch (error) {
            throw error
        }
        
    }
}

export { finalizarPedidoDeliveryServico }


import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import { AppError } from "../../error/appError.js";
import prismaCliente from "../../prisma/index.js"

class carregarPedidoDeliveryServico {
    async executar (uuid) {

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
                    status: 'carregado',
                    dataCarregada: new Date()
                }
            })

            return pedidoAlterado


        } catch (error) {
            throw error
        }
        
    }
}

export { carregarPedidoDeliveryServico }


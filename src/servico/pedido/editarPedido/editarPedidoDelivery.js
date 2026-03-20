import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js";
import { AppError } from "../../../error/appError.js";
import prismaCliente from "../../../prisma/index.js"

class EditarPedidoDelivery {
    async executar(uuid, formaPagamentoId, dados) {
        try {

            // recacular total
            const total = dados.reduce((acc, item) => {
                return acc + item.preco * item.quantidade;
            }, 0);

            // calculando total de cada item
            const itensFormatados = dados.map(item => {
                const valorTotal = item.quantidade * item.valorUnit

                // retornando o objeto apenas alterando o valorTotal
                return {
                    ...item,
                    valorTotal: valorTotal
                }
            })

            await prismaCliente.pedidoDelivery.update({
                where: {
                    uuid: uuid
                },
                data: {
                    total: total,
                    formaPagamentoId: formaPagamentoId,
                    itens: {
                        deleteMany: {},
                        createMany: {
                            data: itensFormatados
                        }
                    }
                }
            })
            
        } catch (error) {
            throw new AppError(
                "Não foi possivel editar o pedido",
                HTTP_STATUS_CODES.NOT_FOUND,
                "EDITAR_PEDIDO_NOT_FOUND"
            )
        }
    }   
}

export { EditarPedidoDelivery }
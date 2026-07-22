import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js";
import { AppError } from "../../../error/appError.js";
import prismaCliente from "../../../prisma/index.js";

class EditarPedidoBalcao {
    async executar(uuid, formasPagamentos, dados) {
        try {

        await prismaCliente.$transaction(async (tx) => {

            const data = {};

            if (dados?.length) {

                const itensFormatados = dados.map(item => ({
                    ...item,
                    valorTotal: item.quantidade * item.valorUnit
                }));

                data.total = itensFormatados.reduce(
                    (acc, item) => acc + item.valorTotal,
                    0
                );

                data.itens = {
                    deleteMany: {},
                    createMany: {
                        data: itensFormatados
                    }
                };
            }

            
            if (formasPagamentos?.length) {

                data.pagamentos = {
                    deleteMany: {},
                    createMany: {
                        data: formasPagamentos.map(p => ({
                            formaPagamentoId: p.formaPagamentoId,
                            valor: p.valor
                        }))
                    }
                };

            }

            await tx.pedidoBalcao.update({
                where: {
                    uuid
                },
                data
            });

        });

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export { EditarPedidoBalcao };
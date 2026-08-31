import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import prismaCliente from "../../prisma/index.js"
import { AppError } from "../../error/appError.js"


class DeletarMovimentacaoPagamentosEletronicosServico {
    async executar(id) {
        try {

            const movimentacao = await prismaCliente.movimentacaoPagamentosEletronicos.findFirst({
                where: {
                    id
                }
            })

            if(!movimentacao) {
                throw new AppError(
                "Movimentação não encontrada",
                HTTP_STATUS_CODES.NOT_FOUND,
                "MOVIMENTACAO_NOT_FOUND"
                )
            }

            const resultado = await prismaCliente.movimentacaoPagamentosEletronicos.delete({
                where: {
                    id
                }
            })

            return resultado
        } catch (error) {
            throw error
        }
    }
}


export { DeletarMovimentacaoPagamentosEletronicosServico }
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import prismaCliente from "../../prisma/index.js"
import { AppError } from "../../error/appError.js"


class DeletarMovimentacaoServico {
    async executar(id) {
        try {

            const movimentacao = await prismaCliente.movimentacaoManual.findFirst({
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

            const resultado = await prismaCliente.movimentacaoManual.delete({
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


export { DeletarMovimentacaoServico }
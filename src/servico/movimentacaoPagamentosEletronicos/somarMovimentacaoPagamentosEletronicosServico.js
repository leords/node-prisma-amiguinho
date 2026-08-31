import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class SomarMovimentacaoPagamentosEletronicosServico { 
    async executar(fechamentoId) {
        
        try {
            const fechamento = await prismaCliente.fechamento.findUnique({
                where: {
                    id: fechamentoId
                }
            })

            if(!fechamento) {
                throw new AppError(
                    "Fechamento não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "FECHAMENTO_NOT_FOUND"
                )
            }

            const resultado = await prismaCliente.movimentacaoPagamentosEletronicos.aggregate({
                where: {
                    fechamentoId
                },
                _sum: {
                    valor: true
                },
                _count: {
                    valor: true
                }
            })

            return {
                movimentacoes: resultado._sum.valor,
                quantidade: resultado._count.valor
            }
        } catch (error) {
            
        }
    }
}

export { SomarMovimentacaoPagamentosEletronicosServico }
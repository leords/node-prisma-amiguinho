import prismaCliente from "../../prisma/index.js"

class SomarMovimentacaoServico { 
    async executar(fechamentoId) {
        
        try {
            const fechamento = await prismaCliente.fechamento.findUnique({
                where: {
                    id: fechamentoId
                }
            })

            if(!fechamento) {
                throw new Error('Fechamento não encontrado')
            }

            const resultado = await prismaCliente.movimentacaoManual.aggregate({
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

export { SomarMovimentacaoServico }
import prismaCliente from "../../prisma/index.js";

class BuscarMovimentacaoServico { 
    async executar(fechamentoId) {
        try {
            const fechamento = await prismaCliente.fechamento.findUnique({
                where: {
                    id: fechamentoId
                }
            });

            if(!fechamento) {
                throw new Error('Fechamento não encontrado');
            }

            const resultado = await prismaCliente.movimentacaoManual.findMany({
                where: {
                    fechamentoId
                }
            });

            return resultado
        } catch (error) {
            throw error
        }
    }
}

export { BuscarMovimentacaoServico }
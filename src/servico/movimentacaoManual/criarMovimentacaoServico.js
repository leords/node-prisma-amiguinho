import prismaCliente from "../../prisma/index.js"

class CriarMovimentacaoServico {
    async executar(fechamentoId, tipo, descricao, valor) {
        try {

            const fechamento = await prismaCliente.fechamento.findUnique({
                where: {
                    id: fechamentoId
                }
            });

            if (!fechamento) {
                throw new Error("Fechamento não encontrado");
            }


            const resultado = await prismaCliente.movimentacaoManual.create({
                data: {
                    fechamentoId,
                    tipo,
                    descricao,
                    valor
                }
            });

            return resultado
        } catch (error) {
            throw error
        }
    }
}

export { CriarMovimentacaoServico }
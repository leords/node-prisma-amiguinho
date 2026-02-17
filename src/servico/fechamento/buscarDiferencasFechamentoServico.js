import prismaCliente from "../../prisma/index.js"

class BuscarDiferencasFechamentoService {
    async executar(setor, inicio, fim, vendedor) {
        try {
            const busca = await prismaCliente.fechamento.aggregate({
                _sum: {
                    diferenca : true
                },
                where: {
                    data: {
                        gte: inicio,
                        lte: fim
                    },
                    vendedor,
                    setor
                }
            })

            const retornoFinal = {
                diferenca: busca._sum.diferenca || 0,
                vendedor: vendedor,
                setor: setor
            }

            return retornoFinal

        } catch (error) {
            throw error
        }
    }
}

export { BuscarDiferencasFechamentoService }
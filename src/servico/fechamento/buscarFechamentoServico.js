import prismaCliente from "../../prisma/index.js"

class BuscarFechamentoServico {
    async executar(vendedor, setor, dataInicio, dataFim) {
        try {
            const resultado = await prismaCliente.fechamento.findFirst({  
                where: {
                    vendedor,
                    setor,
                    data: {
                        gte: dataInicio,
                        lte: dataFim
                    }
                }
            });

            if(!resultado) {
                throw new Error('Nenhum fechamento encontrado')
            }

            return resultado
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export { BuscarFechamentoServico }
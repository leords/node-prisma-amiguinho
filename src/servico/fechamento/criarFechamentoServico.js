import prismaCliente from "../../prisma/index.js"

class CriarFechamentoServico {
    async executar(setor, vendedor) {
        try {
            const data = new Date()

            const dataInicio = new Date(data)
            dataInicio.setHours(0, 0, 0, 0)

            const dataFim = new Date(data)
            dataFim.setHours(23, 59, 59, 999)


            const existeFechamento = await prismaCliente.fechamento.findFirst({
                where: {
                    setor,
                    vendedor,
                    data: {
                        gte: dataInicio,
                        lte: dataFim
                    }
                }
            })

            if(existeFechamento) {
                throw new Error(`Já existe um fechamento em aberto para o dia de hoje, referente a este vendedor e setor`);
            }

            return await prismaCliente.fechamento.create({
                data: {
                    setor,
                    vendedor
                }
             })
             
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}


export { CriarFechamentoServico }
import prismaCliente from "../../prisma/index.js"

class CriarFechamentoServico {
    async executar(setor, vendedor, totalSistema, totalInformado, diferenca) {
        try {

            const data = new Date()

            //const dataInicio = data ? new Date(`${data}T00:00:00-03:00`) : undefined
            //const dataFim = data ? new Date(`${data}T23:59:59.999-03:00`) : undefined

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
                    vendedor,
                    totalSistema,
                    totalInformado,
                    diferenca
                }
             })
             
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}


export { CriarFechamentoServico }
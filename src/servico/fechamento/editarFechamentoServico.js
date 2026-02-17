import prismaCliente from "../../prisma/index.js"

class EditarFechamentoServico {
    async executar(id, status) {
        try {

            const existeFechamento = await prismaCliente.fechamento.findFirst({
                where: {
                    id
                }
            })

            if(!existeFechamento) {
                throw new Error('Nenhum fechamento encontrado')
            }


            const resultado = await prismaCliente.fechamento.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })

            return resultado
        } catch (error) {
            throw error
        }
    }
}

export { EditarFechamentoServico }
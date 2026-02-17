import prismaCliente from "../../prisma/index.js";

class DeletarFechamentoServico {
    async executar(id) {
        try {
            const existeFechamento = await prismaCliente.fechamento.findFirst({
                where: {
                    id
                }
            });
            
            if(!existeFechamento) {
                throw new Error('Nenhum fechamento encontrado')
            }

            const resultado = await prismaCliente.fechamento.delete({
                where: {
                    id
                }
            })

            if(!resultado) {
                throw new Error('Erro ao deletar fechamento')
            }


            return 'Fechamento deletado com sucesso!'
        } catch (error) {
            throw error
        }
    }
}

export { DeletarFechamentoServico }
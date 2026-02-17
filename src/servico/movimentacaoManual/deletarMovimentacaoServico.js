import prismaCliente from "../../prisma/index.js"

class DeletarMovimentacaoServico {
    async executar(id) {
        try {

            const movimentacao = await prismaCliente.movimentacaoManual.findUnique({
                where: {
                    id
                }
            })

            if(!movimentacao) {
                throw new Error('Movimentação não encontrada')
            }

            const resultado = await prismaCliente.movimentacaoManual.delete({
                where: {
                    id
                }
            })

            return resultado
        } catch (error) {
            throw error
        }
    }
}


export { DeletarMovimentacaoServico }
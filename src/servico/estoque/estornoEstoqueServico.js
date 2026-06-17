import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes"
import { AppError } from "../../error/appError"
import prismaCliente from "../../prisma"


class estornoEstoqueServico {
    async executar(pedido, prisma) {

        try {

            // Validando pedido
            if(!pedido) {
                throw new AppError(
                    "Pedido não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PEDIDO_NOT_FOUND"
                )
            }

            // Percorrendo itens do pedido
            for (const item of pedido.itens) {
            
                // buscando o produto pelo id.
                const produto = await prisma.produto.findUnique({
                    where: { id: item.produtoId }
                })

                // validando existencia do produto.
                if(!produto) {
                    throw new AppError(
                        "Produto não encontrado",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "PRODUTO_NOT_FOUND"
                    )
                }
                    
                // Criando a movimentação.        
                await prisma.estoque.create({
                    data: {
                        produtoId: item.produtoId,
                        tipo: "AJUSTE",
                        quantidade: item.quantidade,
                        origem: 'ESTORNO', /// passando o setor de vendas.
                        origemId: pedido.id,
                        usuarioId: pedido.usuarioId
                    }
                })

                // Atualização do estoque.
                await prisma.produto.update({
                    where: { id: item.produtoId },
                    data: {
                        estoque: {
                        increment: item.quantidade
                        }
                    }
                }); 
            }

            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export { estornoEstoqueServico }
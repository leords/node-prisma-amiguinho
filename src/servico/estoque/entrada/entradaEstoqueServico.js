import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js"
import { AppError } from "../../../error/appError.js"
import prismaCliente from "../../../prisma/index.js"

class EntradaEstoqueServico {
    async executar(ordemCompra) {

        // validando a ordem de compra
        if(!ordemCompra) {
            if(!produto) {
                throw new AppError(
                    "Produto não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,                        
                    "PRODUTO_NOT_FOUND"
                )
            }
        }

        // percorrendo os itens da ordem da compra
        for (const item of ordemCompra.itens) {
            
            return prismaCliente.$transaction(async (prisma) => { 
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
                        tipo: "ENTRADA",
                        quantidade: item.quantidade,
                        origem: ordemCompra.fornecedor, /// passando o setor de vendas.
                        origemId: ordemCompra.fornecedorId,
                        usuarioId: ordemCompra.usuarioId
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
            })
        }
    }
}


export { EntradaEstoqueServico }
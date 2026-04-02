import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js"
import { AppError } from "../../../error/appError.js"
import prismaCliente from "../../../prisma/index.js"

class SaidaEstoqueDelivery {
    async executar (pedidoId, prisma) {
            
            const pedido = await prisma.pedidoDelivery.findUnique({
                where: { id: pedidoId },
                include: { itens: true }
            })

            // valida existencia do pedido
            if(!pedido) {
                throw new AppError(
                    "Pedido não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PEDIDO_NOT_FOUND"
                )
            }

            // valida se o mesmo ja foi carregado
            if(pedido.status === "finalizado") {
                throw new AppError(
                    "Pedido já processado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PEDIDO_NOT_FOUND"
                )
            }
            
            for (const item of pedido.itens) {

                // buscando o produto pelo id
                const produto = await prisma.produto.findUnique({
                    where: { id: item.produtoId }
                })

                // verifica quantidade em estoque
                if (produto.estoque < item.quantidade) {
                    throw new AppError(
                        `Estoque insuficiente do produto: ${produto.nome}`,
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "QUANTIDADE_NOT_FOUND"
                    )
                }


                if(pedido.status === 'pendente') {
                    // Criando a movimentação
                    await prisma.estoque.create({
                        data: {
                            produtoId: item.produtoId,
                            tipo: "SAIDA",
                            quantidade: -item.quantidade,
                            origem: pedido.tipo, /// passando o setor de vendas
                            origemId: pedido.id,
                            usuarioId: pedido.usuarioId
                        }
                    })

                    // Atualização do estoque
                    await prisma.produto.update({
                    where: { id: item.produtoId },
                        data: {
                            estoque: {
                            decrement: item.quantidade
                            }
                        }
                    });
                }
            }
    
            // atualiza status
            return await prisma.pedidoDelivery.update({
            where: { id: pedidoId },
            data: { status: "carregado" }
            })
    }
}

export { SaidaEstoqueDelivery }
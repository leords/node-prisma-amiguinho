import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js"
import { AppError } from "../../../error/appError.js"
import prismaCliente from "../../../prisma/index.js"

class SaidaEstoqueBalcao {
    async executar (pedidoId, prisma) {
          
        const pedido = await prisma.pedidoBalcao.findUnique({
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
                if (produto.estoque < (item.quantidade / produto.quantidade)) {
                    throw new AppError(
                        `Estoque insuficiente do produto: ${produto.nome}`,
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "QUANTIDADE_NOT_FOUND"
                    )
                }

                // tranformando UND em caixa
                const quantidadeTransformada = -item.quantidade / produto.quantidade

                // Criando a movimentação
                await prisma.estoque.create({
                    data: {
                        produto: {
                            connect: { id: item.produtoId }
                        },
                        tipo: "SAIDA",
                        quantidade: quantidadeTransformada,
                        origem: pedido.tipo, /// passando o setor de vendas
                        origemId: pedido.id,
                        usuario: {
                            connect: { id: pedido.usuarioId } 
                        }
                    }
                })

                // Atualização do estoque
                await prisma.produto.update({
                where: { id: item.produtoId },
                    data: {
                        estoque: {
                        decrement: Math.abs(quantidadeTransformada)
                        }
                    }
                });

            }
    
            // Atualiza status
            return await prisma.pedidoBalcao.update({
            where: { id: pedidoId },
            data: { status: "finalizado" }
            })

    }
}

export { SaidaEstoqueBalcao }
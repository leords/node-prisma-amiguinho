import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"


class estornoEstoqueServico {
    async executar(pedidoId, prisma, setor) {



        try {
            if(setor === 'balcao') {

                // Retorno pedido pelo id
                const pedido = await prisma.pedidoBalcao.findUnique({
                    where : {
                        id: pedidoId
                    }
                })

                // Validando pedido
                if(!pedido) {
                    throw new AppError(
                        "Pedido não encontrado",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "PEDIDO_NOT_FOUND"
                    )
                }

                // Buscando produtos referente ao id do pedido.
                const produtos = await prisma.itemPedidoBalcao.findMany({
                    where: {
                        pedidoId: pedido.id
                    }
                })

                // Validando se tem produtos
                if(produtos.length === 0) {
                    throw new AppError(
                        "Nenhum item encontrado para o pedido",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "ITEMS_NOT_FOUND"
                    )
                }


                // Percorrendo itens do pedido
                for (const item of produtos) {
                    // buscando o produto pelo id.
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                        select: {
                            quantidade: true
                        }
                    })

                    // Validando existencia do produto.
                    if(!produto) {
                        throw new AppError(
                            "Produto não encontrado",
                            HTTP_STATUS_CODES.NOT_FOUND,
                            "PRODUTO_NOT_FOUND"
                        )
                    }

                    const quantidadeEstorno =  item.quantidade / produto.quantidade
                        
                    // Criando a movimentação.        
                    await prisma.estoque.create({
                        data: {
                            produtoId: item.produtoId,
                            tipo: "AJUSTE",
                            quantidade: quantidadeEstorno,
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
                            increment: quantidadeEstorno
                            }
                        }
                    }); 
                }

            }

            else if(setor === 'delivery') {

                // Retorno pedido pelo id
                const pedido = await prisma.pedidoDelivery.findUnique({
                    where : {
                        id: pedidoId
                    }
                })

                // Validando pedido
                if(!pedido) {
                    throw new AppError(
                        "Pedido não encontrado",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "PEDIDO_NOT_FOUND"
                    )
                }

                // Buscando produtos referente ao id do pedido.
                const produtos = await prisma.itemPedidoDelivery.findMany({
                    where: {
                        pedidoId: pedido.id
                    }
                })

                // Validando se tem produtos
                if(produtos.length === 0) {
                    throw new AppError(
                        "Nenhum item encontrado para o pedido",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "ITEMS_NOT_FOUND"
                    )
                }


                // Percorrendo os produtos do pedido
                for (const item of produtos) {

                    // Buscando o produto pelo id.
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                        select: {
                            quantidade: true
                        }
                    })

                    // Validando existencia do produto.
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

            }

            else if(setor === 'externo') {

                // Retorno pedido pelo id
                const pedido = await prisma.pedidoExterno.findUnique({
                    where : {
                        id: pedidoId
                    }
                })

                // Validando pedido
                if(!pedido) {
                    throw new AppError(
                        "Pedido não encontrado",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "PEDIDO_NOT_FOUND"
                    )
                }

                // Buscando produtos referente ao id do pedido.
                const produtos = await prisma.itemPedidoExterno.findMany({
                    where: {
                        pedidoId: pedido.id
                    }
                })

                // Validando se tem produtos
                if(produtos.length === 0) {
                    throw new AppError(
                        "Nenhum item encontrado para o pedido",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "ITEMS_NOT_FOUND"
                    )
                }


                // Percorrendo os produtos do pedido
                for (const item of produtos) {

                    // Buscando o produto pelo id.
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                        select: {
                            quantidade: true
                        }
                    })

                    // Validando existencia do produto.
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
                            origemId: pedido.clienteId,
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

            }

            else {
                throw new AppError(
                    "Setor inválido",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "SETOR_NOT_FOUND"
                )
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export { estornoEstoqueServico }
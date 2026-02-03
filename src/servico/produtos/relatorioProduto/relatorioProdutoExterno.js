import prismaCliente from "../../../prisma/index.js"

export const RelatorioProdutoExterno = async (inicio, fim, vendedor, produtoId) => {
                        const totais = await prismaCliente.itemPedidoExterno.aggregate({
                        where: {
                            produtoId: produtoId,
                            pedido: {
                                vendedor: vendedor,
                                data: {
                                    gte: inicio,
                                    lte: fim
                                }
                            }
                        },
                        _sum: {
                            quantidade: true,
                            valorTotal: true
                        }
                    })

                    const totalQuantidade = totais._sum.quantidade ? totais._sum.quantidade : 0
                    const totalValorTotal = totais._sum.valorTotal ? totais._sum.valorTotal : 0

                    
                    // QUANTOS PEDIDOS FOI POSITIVADO O PRODUTO
                    const pedidoPositavo = await prismaCliente.itemPedidoExterno.groupBy({
                        by: ['pedidoId'],
                        where: {
                            produtoId: produtoId,
                            pedido: {
                                vendedor: vendedor,
                                data: {
                                    gte: inicio,
                                    lte: fim
                                }
                            }
                        },
                    })

                    const quantidadePedidoPositivado = pedidoPositavo.length
                    

                    // TOTAL DE PEDIDOS REALIZADOS
                    const totalPedidos = await prismaCliente.pedidoExterno.count({
                        where: {
                            vendedor: vendedor,
                            data: {
                                gte: inicio,
                                lte: fim
                            }
                        }
                    });


                    // QUANTIDADE MÉDIA DO PRODUTO POR PEDIDO
                        const mediaProdutoPorPedido = totalQuantidade / quantidadePedidoPositivado
                    // PREÇO MÉDIO DO PRODUTO
                        const precoMedio = totalValorTotal / totalQuantidade
                    // PORCENTUAL DE PEDIDOS POSITIVADOS
                        const pedidoPositivadorComProduto = quantidadePedidoPositivado / totalPedidos * 100

                    const resultadoExterno = {
                        quantidade: totalQuantidade,
                        precoMedio: precoMedio,
                        faturamentoTotal: totalValorTotal,
                        mediaProdutoPorPedido: mediaProdutoPorPedido,
                        pedidoPositavo: quantidadePedidoPositivado,
                        totalPedidos: totalPedidos,
                        porcentualPositivado: pedidoPositivadorComProduto
                    }
                    return resultadoExterno
}
import prismaCliente from '../../prisma/index.js'

class TopProdutosServico {
  async executar(setor, inicio, fim, vendedor, quantidade) {
    try {
      // SETOR BALCÃO!!!
      if (setor === 'balcao') {
        const itensAgrupados = await prismaCliente.itemPedidoBalcao.groupBy({
          by: ['produtoId'],

          where: {
            pedido: {
              vendedor: vendedor || undefined, // opcional
              data: {
                gte: new Date(inicio),
                lte: new Date(fim),
              },
              status: 'carregado',
            },
          },

          _sum: {
            quantidade: true,
            valorTotal: true,
          },

          orderBy: {
            _sum: {
              quantidade: 'desc',
            },
          },

          take: quantidade,
        })

        // BUSCA OS DADOS DOS PRODUTOS.
        // (groupBy não permite include).
        const produtosIds = itensAgrupados.map((item) => item.produtoId)

        const produtos = await prismaCliente.produto.findMany({
          where: {
            id: { in: produtosIds },
          },
          select: {
            id: true,
            nome: true,
          },
        })

        // MONTA O RETORNO FINAL.
        const resultado = itensAgrupados.map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId)

          return {
            produtoId: item.produtoId,
            nomeProduto: produto?.nome ?? 'Não informado',
            quantidadeVendida: item._sum.quantidade,
            valorTotalVendido: item._sum.valorTotal,
          }
        })

        return resultado
      }

      // SETOR DELIVERY
      if (setor === 'delivery') {
        const itensAgrupados = await prismaCliente.itemPedidoDelivery.groupBy({
          by: ['produtoId'],

          where: {
            pedido: {
              vendedor: vendedor || undefined, // opcional
              data: {
                gte: new Date(inicio),
                lte: new Date(fim),
              },
              status: 'entregue',
            },
          },

          _sum: {
            quantidade: true,
            valorTotal: true,
          },

          orderBy: {
            _sum: {
              quantidade: 'desc',
            },
          },

          take: quantidade,
        })

        // BUSCA OS DADOS DOS PRODUTOS.
        // (groupBy não permite include).

        const produtosIds = itensAgrupados.map((item) => item.produtoId)

        const produtos = await prismaCliente.produto.findMany({
          where: {
            id: { in: produtosIds },
          },
          select: {
            id: true,
            nome: true,
          },
        })

        // MONTA O RETORNO FINAL.

        const resultado = itensAgrupados.map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId)

          return {
            produtoId: item.produtoId,
            nomeProduto: produto?.nome ?? 'Não informado',
            quantidadeVendida: item._sum.quantidade,
            valorTotalVendido: item._sum.valorTotal,
          }
        })

        return resultado
      }

      // SETOR EXTERNO
      if (setor === 'externo') {
        const itensAgrupados = await prismaCliente.itemPedidoExterno.groupBy({
          by: ['produtoId'],

          where: {
            pedido: {
              vendedor: vendedor || undefined, // opcional
              data: {
                gte: new Date(inicio),
                lte: new Date(fim),
              },
              status: 'entregue',
            },
          },

          _sum: {
            quantidade: true,
            valorTotal: true,
          },

          orderBy: {
            _sum: {
              quantidade: 'desc',
            },
          },

          take: quantidade,
        })

        // BUSCA OS DADOS DOS PRODUTOS.
        // (groupBy não permite include).

        const produtosIds = itensAgrupados.map((item) => item.produtoId)

        const produtos = await prismaCliente.produto.findMany({
          where: {
            id: { in: produtosIds },
          },
          select: {
            id: true,
            nome: true,
          },
        })

        // MONTA O RETORNO FINAL.

        const resultado = itensAgrupados.map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId)

          return {
            produtoId: item.produtoId,
            nomeProduto: produto?.nome ?? 'Não informado',
            quantidadeVendida: item._sum.quantidade,
            valorTotalVendido: item._sum.valorTotal,
          }
        })

        return resultado
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { TopProdutosServico }

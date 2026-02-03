import prismaCliente from '../../../prisma/index.js'


export const QuantidadePedidoDelivery = async(vendedor, dataInicio, dataFim) => {
            const quantidadePedidos = await prismaCliente.pedidoDelivery.groupBy({
          by: ['vendedor'],
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
          _count: {
            id: true,
          },
        })

        const totais = quantidadePedidos.map((item) => {
          return {
            vendedor: item.vendedor,
            quantidadePedidos: item._count.id,
          }
        })

        return totais
}
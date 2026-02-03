import prismaCliente from "../../../prisma/index.js"



export const QuantidadePedidoBalcao = async(vendedor, dataInicio, dataFim) => {
        const quantidadePedidos = await prismaCliente.pedidoBalcao.groupBy({
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
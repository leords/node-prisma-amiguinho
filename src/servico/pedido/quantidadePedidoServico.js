import prismaCliente from '../../prisma/index.js'

class QuantidadePedidoServico {
  async executar(setor, vendedor, dataInicio, dataFim) {
    try {
      // ------------------------------------
      // SETOR BALCAO
      // ------------------------------------

      if (setor === 'balcao') {
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

      // ------------------------------------
      // SETOR DELIVERY
      // ------------------------------------

      if (setor === 'delivery') {
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

      // ------------------------------------
      // SETOR EXTERNO
      // ------------------------------------

      if (setor === 'externo') {
        const quantidadePedidos = await prismaCliente.pedidoExterno.groupBy({
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
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { QuantidadePedidoServico }

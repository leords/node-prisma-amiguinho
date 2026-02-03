import prismaCliente from '../../prisma/index.js'

class TotalVendasPeriodoServico {
  async executar(setor, vendedor, dataInicio, dataFim) {
    try {
      
      // ------------------------------------
      // SETOR BALCAO
      // ------------------------------------

      if (setor === 'balcao') {
        const totalVendas = await prismaCliente.pedidoBalcao.aggregate({
          _sum: {
            total: true,
          },
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        const quantidadePedidos = await prismaCliente.pedidoBalcao.count({
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        return {
          totalVendas: totalVendas._sum.total,
          quantidadePedidos,
        }
      }

      // ------------------------------------
      // SETOR DELIVERY
      // ------------------------------------

      if (setor === 'delivery') {
        const totalVendas = await prismaCliente.pedidoDelivery.aggregate({
          _sum: {
            total: true,
          },
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        const quantidadePedidos = await prismaCliente.pedidoDelivery.count({
          where: {
            data: {
              vendedor: vendedor,
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        return {
          totalVendas: totalVendas._sum.total,
          quantidadePedidos,
        }
      }

      // ------------------------------------
      // SETOR EXTERNO
      // ------------------------------------

      if (setor === 'externo') {
        const totalVendas = await prismaCliente.pedidoExterno.aggregate({
          _sum: {
            total: true,
          },
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        const quantidadePedidos = await prismaCliente.pedidoExterno.count({
          where: {
            vendedor: vendedor,
            data: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        })

        return {
          totalVendas: totalVendas._sum.total,
          quantidadePedidos,
        }
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { TotalVendasPeriodoServico }

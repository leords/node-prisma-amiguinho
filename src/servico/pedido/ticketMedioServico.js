import prismaCliente from '../../prisma/index.js'

class TicketMedioServico {
  async executar(setor, vendedor, dataInicio, dataFim) {
    try {
      console.log('setor: ', setor)
      const query = {}

      if (vendedor) {
        query.vendedor = vendedor
      }
      if (dataInicio && dataFim) {
        query.data = {
          gte: dataInicio,
          lte: dataFim,
        }
      }

      if (setor === 'delivery') {
        return await prismaCliente.pedidoDelivery.aggregate({
          where: query,
          _avg: {
            total: true,
          },
        })
      }

      if (setor === 'externo') {
        return await prismaCliente.pedidoExterno.aggregate({
          where: query,
          _avg: {
            total: true,
          },
        })
      }

      if (setor === 'balcao') {
        console.log('setor correto')

        const [avgResultado, quantidadePedidos] = await Promise.all([
          prismaCliente.pedidoBalcao.aggregate({
            where: query,
            _avg: {
              total: true,
            },
          }),
          prismaCliente.pedidoBalcao.count({
            where: query,
          }),
        ])

        return {
          pedidoMedio: avgResultado._avg.total ?? 0,
          quantidadePedidos,
        }
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { TicketMedioServico }

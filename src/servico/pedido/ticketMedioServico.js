import prismaCliente from '../../prisma/index.js'

class TicketMedioServico {
  async executar(setor, vendedor, inicio, fim) {


    try {
      const query = {}

      if (vendedor) {
        query.vendedor = vendedor
      }
      if (inicio && fim) {
        query.data = {
          gte: inicio,
          lte: fim,
        }
      }

      if (setor === 'delivery') {
        query.status = 'entregue'
        return await prismaCliente.pedidoDelivery.aggregate({
          where: query,
          _avg: {
            total: true,
          },
        })
      }

      if (setor === 'externo') {
        query.status = 'entregue'
        return await prismaCliente.pedidoExterno.aggregate({
          where: query,
          _avg: {
            total: true,
          },
        })
      }

      if (setor === 'balcao') {
        query.status = 'carregado'
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

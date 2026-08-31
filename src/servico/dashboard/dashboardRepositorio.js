import prismaCliente from '../../prisma/index.js'

class DashboardRepositorio {
  async buscarPedidos(dataInicio, dataFim) {
    const where = {}

    // se as datas existir, popular o objeto where com dataInicio e dataFim
    if (dataInicio && dataFim) {
      where.data = {
        gte: dataInicio,
        lte: dataFim,
      }
    }

    // Promisse all, faz varias chamadas, caso alguma falhe, todas são rejeitadas.
    const [pedidosBalcao, pedidosDelivery, pedidosExterno] = await Promise.all([
      // buscando todos os pedidos de balcão no intervalo de datas
      prismaCliente.pedidoBalcao.findMany({
        where: {
          ...where,
          status: 'finalizado',
        },
        select: {
          id: true,
          total: true,
          vendedor: true,
          data: true,

          pagamentos: {
            select: {
              valor: true,
              formaPagamento: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      }),

      // buscando todos os pedidos de delivery no intervalo de datas
      prismaCliente.pedidoDelivery.findMany({
        where: {
          ...where,
          status: 'entregue',
        },
        select: {
          id: true,
          total: true,
          vendedor: true,
          dataCarregada: true,
          dataEntrega: true,
          status: true,

          formaPagamento: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      }),

      // buscando todos os pedidos de externo no intervalo de datas
      prismaCliente.pedidoExterno.findMany({
        where: {
          ...where,
          status: 'finalizado',
        },
        select: {
          id: true,
          total: true,
          vendedor: true,
          data: true,
          status: true,
          formaPagamento: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      }),
    ])

    // retornando os resultados da promisse All
    return {
      pedidos: {
        balcao: pedidosBalcao,
        delivery: pedidosDelivery,
        externo: pedidosExterno,
      },
    }
  }
}

export { DashboardRepositorio }

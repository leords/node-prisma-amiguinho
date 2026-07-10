import prismaCliente from "../../prisma/index.js"

class BuscarPedidoServico {
  async executar(
    setor,
    vendedor,
    cliente,
    formaPagamentoId,
    dataInicio,
    dataFim,
    usuarioId,
    status
  ) {

    // Campos comuns aos três models
    const queryBase = {}
    if (vendedor) queryBase.vendedor = vendedor
    if (usuarioId) queryBase.usuarioId = usuarioId
    if (dataInicio && dataFim) {
      queryBase.data = { 
        gte: dataInicio, 
        lte: dataFim 
      }
    }

    if (status) queryBase.status = status

    // Delivery: cliente é relação (via clienteId), formaPagamentoId é escalar direto
    const queryDelivery = { ...queryBase }
    if (formaPagamentoId) queryDelivery.formaPagamentoId = formaPagamentoId
    if (cliente) {
      queryDelivery.cliente = { 
        nome: { 
          contains: cliente, 
          mode: 'insensitive' 
        } 
      }
    }

    // Externo: mesma estrutura do Delivery
    const queryExterno = { ...queryBase }
    if (formaPagamentoId) queryExterno.formaPagamentoId = formaPagamentoId
    if (cliente) {
      queryExterno.cliente = { 
        nome: { 
          contains: cliente, 
          mode: 'insensitive' 
        } 
      }
    }

    // Balcao: cliente é String simples, formaPagamentoId vem via relação "pagamentos"
    const queryBalcao = { ...queryBase }
    if (cliente) {
      queryBalcao.cliente = { 
        contains: cliente, 
        mode: 'insensitive' 
      }
    }
    if (formaPagamentoId) {
      queryBalcao.pagamentos = {
        some: { 
          formaPagamentoId 
        }
      }
    }

    try {
      if (setor === 'delivery') {
        return await prismaCliente.pedidoDelivery.findMany({
          where: queryDelivery,
          include: { 
            itens: true, 
            cliente: true, 
            formaPagamento: true 
          },
          orderBy: { 
            data: 'desc' 
          }
        })
      }

      if (setor === 'externo') {
        return await prismaCliente.pedidoExterno.findMany({
          where: queryExterno,
          include: { 
            itens: true, 
            cliente: true, 
            formaPagamento: true 
          },
          orderBy: { 
            data: 'desc' 
          }
        })
      }

      if (setor === 'balcao') {
        return await prismaCliente.pedidoBalcao.findMany({
          where: queryBalcao,
          include: {
            itens: true,
            pagamentos: { 
              include: { 
                formaPagamento: true
              } 
            },
          },
          orderBy: { 
            data: 'desc' 
          }
        })
      }

      const [pedidosDelivery, pedidosExterno, pedidosBalcao] = await Promise.all([

        prismaCliente.pedidoDelivery.findMany({
          where: queryDelivery,
          include: { 
            itens: true, 
            cliente: true, 
            formaPagamento: true 
          },
          orderBy: { 
            data: 'desc' 
          }
        }),

        prismaCliente.pedidoExterno.findMany({
          where: queryExterno,
          include: { 
            itens: true, 
            cliente: true, 
            formaPagamento: true 
          },
          orderBy: { 
            data: 'desc' 
          }
        }),

        prismaCliente.pedidoBalcao.findMany({
          where: queryBalcao,
          include: {
            itens: true,
            pagamentos: { 
              include: { 
                formaPagamento: true 
              } 
            },
          },
          orderBy: { 
            data: 'desc'
          }
        }),
      ])

      return [...pedidosDelivery, ...pedidosExterno, ...pedidosBalcao]

    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { BuscarPedidoServico }
import prismaCliente from '../../prisma/index.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarPedidoServico {
  async executar(
    setor,
    vendedor,
    cliente,
    formaPagamentoId,
    dataInicio,
    dataFim,
    usuarioId
  ) {

    const query = {}

    // Montando o query conforme a existencia dos valores
    if (vendedor) {
      query.vendedor = vendedor
    }
    if (cliente) {
      query.cliente = cliente
    }
    if (formaPagamentoId) {
      query.formaPagamentoId = formaPagamentoId
    }
    if (usuarioId) {
      query.usuarioId = usuarioId
    }
    if (dataInicio && dataFim) {
      query.data = {
        gte: dataInicio,
        lte: dataFim,
      }
    }

    const queryDelivery = {
      ...query,
      status: 'entregue',
    }

    const queryExterno = {
      ...query,
      status: 'entregue',
    }

    const queryBalcao = {
      ...query,
      status: 'carregado',
    }

    try {
      if (setor === 'delivery') {
        return await prismaCliente.pedidoDelivery.findMany({
          where: queryDelivery,
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
        })
      }

      if (setor === 'externo') {
        return await prismaCliente.pedidoExterno.findMany({
          where: queryExterno,
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
        })
      }

      if (setor === 'balcao') {
        return await prismaCliente.pedidoBalcao.findMany({
          where: queryBalcao,
          include: {
            itens: true,
            formaPagamento: true,
          },
        })
      }

      // Se nenhum setor for especificado, buscar em todos
      const [pedidosDelivery, pedidosExterno, pedidosBalcao] =
        await Promise.all([
          prismaCliente.pedidoDelivery.findMany({
            where: queryDelivery,
            include: {
              itens: true,
              cliente: true,
              formaPagamento: true,
            },
          }),
          prismaCliente.pedidoExterno.findMany({
            where: queryExterno,
            include: {
              itens: true,
              cliente: true,
              formaPagamento: true,
            },
          }),
          prismaCliente.pedidoBalcao.findMany({
            where: queryBalcao,
            include: {
              itens: true,
              formaPagamento: true,
            },
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

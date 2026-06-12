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
    usuarioId,
    status
  ) {

    const query = {}

    // Montando o query conforme a existencia dos valores
    if (vendedor) {
      query.vendedor = vendedor
    }
    if (cliente) {
      query.cliente = cliente
    }
    
    if (formaPagamentoId ) {
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
      status: status ? status : 'entregue',
    }

    const queryExterno = {
      ...query,
      status: status ? status : 'entregue',
    }

    const queryBalcao = {
      ...query,
      status: status ? status : 'finalizado',
    }

    console.log('debug: ', queryDelivery)

    try {
      if (setor === 'delivery') {
         console.log('debug setor: ', queryDelivery)
        return await prismaCliente.pedidoDelivery.findMany({
          where: queryDelivery,
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
          orderBy: {
            data: 'desc'
          }
        })
      }

      else if (setor === 'externo') {
        return await prismaCliente.pedidoExterno.findMany({
          where: queryExterno,
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
          orderBy: {
            data: 'desc'
          }
        })
      }

      else if (setor === 'balcao') {
        return await prismaCliente.pedidoBalcao.findMany({
          where: queryBalcao,
          include: {
            itens: true,
            formaPagamento: true,
          },
          orderBy: {
            data: 'desc'
          }
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
            orderBy: {
            data: 'desc'
          }
          }),
          prismaCliente.pedidoExterno.findMany({
            where: queryExterno,
            include: {
              itens: true,
              cliente: true,
              formaPagamento: true,
            },
            orderBy: {
            data: 'desc'
          }
          }),
          prismaCliente.pedidoBalcao.findMany({
            where: queryBalcao,
            include: {
              itens: true,
              formaPagamento: true,
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

import { ERRO_MSG_PEDIDOS } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class CriarPedidoServico {
  async executar(setor, dados) {
    try {
      // total calculado automaticamente
      const total = dados.itens.reduce((acc, item) => {
        return acc + item.quantidade * item.valorUnit
      }, 0)

      if (setor === 'delivery') {
        return await prismaCliente.pedidoDelivery.create({
          data: {
            clienteId: dados.clienteId,
            formaPagamentoId: dados.formaPagamentoId,
            usuarioId: dados.usuarioId,
            total,

            itens: {
              createMany: {
                data: dados.itens.map((item) => ({
                  produtoId: item.produtoId,
                  quantidade: item.quantidade,
                  valorUnit: item.valorUnit,
                  valorTotal: item.valorUnit * item.quantidade,
                })),
              },
            },
          },
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
        })
      }

      if (setor === 'externo') {
        return await prismaCliente.pedidoExterno.create({
          data: {
            clienteId: dados.clienteId,
            formaPagamentoId: dados.formaPagamentoId,
            usuarioId: dados.usuarioId,
            total,

            itens: {
              createMany: {
                data: dados.itens.map((item) => ({
                  produtoId: item.produtoId,
                  quantidade: item.quantidade,
                  valorUnit: item.valorUnit,
                  valorTotal: item.valorUnit * item.quantidade,
                })),
              },
            },
          },
          include: {
            itens: true,
            cliente: true,
            formaPagamento: true,
          },
        })
      }

      if (setor === 'balcao') {
        return await prismaCliente.pedidoBalcao.create({
          data: {
            cliente: dados.cliente || null,
            formaPagamentoId: Number(dados.formaPagamentoId),
            vendedor: dados.vendedor,
            nomeUsuario: dados.nomeUsuario,
            usuarioId: Number(dados.usuarioId),
            total,

            itens: {
              createMany: {
                data: dados.itens.map((item) => ({
                  produtoId: item.produtoId,
                  quantidade: item.quantidade,
                  valorUnit: item.valorUnit,
                  valorTotal: item.valorUnit * item.quantidade,
                })),
              },
            },
          },
          include: {
            itens: true,
            formaPagamento: true,
          },
        })
      }

      throw new Error(ERRO_MSG_PEDIDOS.SETOR)
    } catch (error) {
      console.log('ERRO AO CRIAR PEDIDO:', error)
      throw error
    }
  }
}

export { CriarPedidoServico }

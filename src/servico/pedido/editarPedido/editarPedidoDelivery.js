import { HTTP_STATUS_CODES } from '../../../config/httpStatusCodes.js'
import { AppError } from '../../../error/appError.js'
import prismaCliente from '../../../prisma/index.js'

class EditarPedidoDelivery {
  async executar(uuid, formaPagamentoId, dados) {
    try {
      // validando a existencia de forma de pagamento
      const validarFormaPagamento =
        await prismaCliente.formaPagamento.findFirst({
          where: {
            id: formaPagamentoId,
          },
        })

      if (!validarFormaPagamento) {
        throw new AppError(
          'Forma de pagamento não encontrada',
          HTTP_STATUS_CODES.NOT_FOUND,
          'EDITAR_PEDIDO_NOT_FOUND'
        )
      }

      // buscando o pedido e validando
      const validarStatusPedido = await prismaCliente.pedidoDelivery.findFirst({
        where: {
          uuid: uuid,
        },
      })

      if (!validarStatusPedido) {
        throw new AppError(
          'Pedido delivery não encontrado.',
          HTTP_STATUS_CODES.NOT_FOUND,
          'EDITAR_PEDIDO_NOT_FOUND'
        )
      }

      // Alterando dados e forma de pagamento se dados existir
      if (dados && dados.length > 0) {
        // calculando total de cada item
        const itensFormatados = dados.map((item) => {
          const valorTotal = Number(item.quantidade) * Number(item.valorUnit)

          // retornando o objeto apenas alterando o valorTotal
          return {
            produtoId: item.produtoId,
            quantidade: Number(item.quantidade),
            valorUnit: Number(item.valorUnit),
            valorTotal,
          }
        })

        // recalculando total
        const total = itensFormatados.reduce((acc, item) => {
          return acc + item.valorTotal
        }, 0)

        // atualizando
        const resultado = await prismaCliente.pedidoDelivery.update({
          where: {
            uuid: uuid,
          },
          data: {
            total: total,
            formaPagamentoId: formaPagamentoId,
            itens: {
              deleteMany: {},
              createMany: {
                data: itensFormatados,
              },
            },
          },
        })

        return resultado
      }

      // alterando apenas forma de pagamento sem dados.
      await prismaCliente.pedidoDelivery.update({
        where: {
          uuid: uuid,
        },
        data: {
          formaPagamentoId: formaPagamentoId,
        },
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { EditarPedidoDelivery }

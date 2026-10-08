import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { estornoEstoqueServico } from '../estoque/estornoEstoqueServico.js'

class DevolverPedidoExternoServico {
  async executar({ identificador }) {
    if (!identificador) {
      throw new AppError(
        'Identificador do pedido é obrigatório',
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CAMPO_AUSENTE'
      )
    }

    const isNumero = !isNaN(Number(identificador))
    const where = isNumero
      ? { id: Number(identificador) }
      : { uuid: String(identificador) }

    const pedido = await prismaCliente.pedidoExterno.findFirst({
      where,
      include: {
        itens: true,
        pendencias: true,
      },
    })

    if (!pedido) {
      throw new AppError(
        ERRO_MSG_PEDIDOS.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'PEDIDO_NOT_FOUND'
      )
    }

    const statusAtual = String(pedido.status || '').toLowerCase()
    if (statusAtual === 'devolvido') {
      throw new AppError(
        ERRO_MSG_PEDIDOS.JA_DEVOLVIDO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_JA_DEVOLVIDO'
      )
    }

    if (statusAtual === 'cancelado') {
      throw new AppError(
        ERRO_MSG_PEDIDOS.JA_CANCELADO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_JA_CANCELADO'
      )
    }

    const resultado = await prismaCliente.$transaction(async (tx) => {
      // 1. Atualiza o status do pedido para 'devolvido'
      const pedidoAtualizado = await tx.pedidoExterno.update({
        where: { id: pedido.id },
        data: {
          status: 'devolvido',
        },
        include: {
          cliente: true,
          formaPagamento: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
      })

      // 2. Realiza o estorno de estoque dos produtos do pedido
      const estornoServico = new estornoEstoqueServico()
      await estornoServico.executar(pedido.id, tx, 'externo')

      // 3. Se houver pendências financeiras vinculadas (ex: VALE), cancela para não cobrar
      if (pedido.pendencias && pedido.pendencias.length > 0) {
        await tx.pendencia.updateMany({
          where: {
            pedidoId: pedido.id,
            status: { not: 'cancelada' },
          },
          data: {
            status: 'cancelada',
          },
        })
      }

      return pedidoAtualizado
    })

    return resultado
  }
}

export { DevolverPedidoExternoServico }

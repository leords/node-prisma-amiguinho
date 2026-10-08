import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PAGAMENTO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class EditarPagamentoServico {
  async executar({ id, valor, status, formaPagamentoId, observacao }) {
    const pagamentoId = Number(id)
    if (isNaN(pagamentoId)) {
      throw new AppError(
        ERRO_MSG_PAGAMENTO.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const pagamentoExistente = await prismaCliente.pagamento.findUnique({
      where: { id: pagamentoId },
      include: { pendencia: true },
    })

    if (!pagamentoExistente) {
      throw new AppError(
        ERRO_MSG_PAGAMENTO.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'PAGAMENTO_NOT_FOUND'
      )
    }

    const dadosAtualizacao = {}

    if (valor !== undefined) {
      const novoValor = Number(valor)
      if (isNaN(novoValor) || novoValor <= 0) {
        throw new AppError(
          ERRO_MSG_PAGAMENTO.VALOR_INVALIDO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'VALOR_INVALIDO'
        )
      }
      dadosAtualizacao.valor = novoValor
    }

    if (status !== undefined) {
      const statusPermitidos = ['coletado', 'baixado', 'cancelado']
      const statusFormatado = String(status).trim().toLowerCase()
      if (!statusPermitidos.includes(statusFormatado)) {
        throw new AppError(
          'Status inválido. Use coletado, baixado ou cancelado',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'STATUS_INVALIDO'
        )
      }
      dadosAtualizacao.status = statusFormatado
    }

    if (formaPagamentoId !== undefined) {
      if (formaPagamentoId === null) {
        dadosAtualizacao.formaPagamentoId = null
      } else {
        const idForma = Number(formaPagamentoId)
        if (!isNaN(idForma)) {
          dadosAtualizacao.formaPagamentoId = idForma
        }
      }
    }

    if (observacao !== undefined) {
      dadosAtualizacao.observacao = observacao ? String(observacao).trim() : null
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      const pagamentoAtualizado = await prisma.pagamento.update({
        where: { id: pagamentoId },
        data: dadosAtualizacao,
        include: {
          formaPagamento: true,
          usuario: {
            select: { id: true, nome: true, usuario: true, nivelAcesso: true },
          },
        },
      })

      // Recalcula o saldo da pendência após a edição do pagamento
      const pagamentosAtivos = await prisma.pagamento.findMany({
        where: {
          pendenciaId: pagamentoExistente.pendenciaId,
          status: { not: 'cancelado' },
        },
      })

      const totalPago = pagamentosAtivos.reduce((acc, p) => acc + p.valor, 0)
      const pendenciaValorTotal = pagamentoExistente.pendencia.valor

      let statusPendencia = 'aberta'
      if (totalPago >= pendenciaValorTotal - 0.001) {
        statusPendencia = 'fechada'
      } else if (totalPago > 0) {
        statusPendencia = 'parcial'
      }

      const pendenciaAtualizada = await prisma.pendencia.update({
        where: { id: pagamentoExistente.pendenciaId },
        data: {
          valorPago: Number(totalPago.toFixed(2)),
          status: statusPendencia,
        },
      })

      return {
        pagamento: pagamentoAtualizado,
        pendencia: pendenciaAtualizada,
      }
    })

    return resultado
  }
}

export { EditarPagamentoServico }

import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PAGAMENTO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarPagamentoServico {
  async executar({
    pendenciaId,
    valor,
    formaPagamentoId,
    observacao,
    usuarioId,
    nivelAcesso,
  }) {
    const idPendencia = Number(pendenciaId)
    const idUsuario = Number(usuarioId)
    const valorPago = Number(valor)

    if (isNaN(idPendencia) || isNaN(idUsuario) || isNaN(valorPago) || valorPago <= 0) {
      throw new AppError(
        ERRO_MSG_PAGAMENTO.VALOR_INVALIDO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'VALOR_INVALIDO'
      )
    }

    const pendencia = await prismaCliente.pendencia.findUnique({
      where: { id: idPendencia },
    })

    if (!pendencia) {
      throw new AppError(
        'Pendência não encontrada',
        HTTP_STATUS_CODES.NOT_FOUND,
        'PENDENCIA_NOT_FOUND'
      )
    }

    if (pendencia.status === 'cancelada') {
      throw new AppError(
        'Não é possível lançar pagamento em uma pendência cancelada',
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PENDENCIA_CANCELADA'
      )
    }

    if (formaPagamentoId) {
      const forma = await prismaCliente.formaPagamento.findUnique({
        where: { id: Number(formaPagamentoId) },
      })
      if (!forma) {
        throw new AppError(
          'Forma de pagamento não encontrada',
          HTTP_STATUS_CODES.NOT_FOUND,
          'FORMA_PAGAMENTO_NOT_FOUND'
        )
      }
    }

    // Regra: se lançado por EXTERNO (vendedor na rota) -> 'coletado'
    // Se lançado por ADMIN ou outro nível de escritório -> 'baixado'
    const statusPagamento =
      nivelAcesso === 'EXTERNO' ? 'coletado' : 'baixado'

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      const pagamento = await prisma.pagamento.create({
        data: {
          pendenciaId: idPendencia,
          usuarioId: idUsuario,
          formaPagamentoId: formaPagamentoId ? Number(formaPagamentoId) : null,
          valor: valorPago,
          status: statusPagamento,
          observacao: observacao ? String(observacao).trim() : null,
        },
        include: {
          formaPagamento: true,
          usuario: {
            select: { id: true, nome: true, usuario: true, nivelAcesso: true },
          },
        },
      })

      // Busca todos os pagamentos não cancelados para recalcular o valor pago total
      const pagamentosAtivos = await prisma.pagamento.findMany({
        where: {
          pendenciaId: idPendencia,
          status: { not: 'cancelado' },
        },
      })

      const totalPago = pagamentosAtivos.reduce((acc, p) => acc + p.valor, 0)

      let statusPendencia = 'aberta'
      if (totalPago >= pendencia.valor - 0.001) {
        statusPendencia = 'fechada'
      } else if (totalPago > 0) {
        statusPendencia = 'parcial'
      }

      const pendenciaAtualizada = await prisma.pendencia.update({
        where: { id: idPendencia },
        data: {
          valorPago: Number(totalPago.toFixed(2)),
          status: statusPendencia,
        },
      })

      return {
        pagamento,
        pendencia: pendenciaAtualizada,
      }
    })

    return resultado
  }
}

export { CriarPagamentoServico }

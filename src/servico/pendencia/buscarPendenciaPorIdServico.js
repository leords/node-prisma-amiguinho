import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PENDENCIA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class BuscarPendenciaPorIdServico {
  async executar({ id }) {
    const pendenciaId = Number(id)
    if (isNaN(pendenciaId)) {
      throw new AppError(
        ERRO_MSG_PENDENCIA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const pendencia = await prismaCliente.pendencia.findUnique({
      where: { id: pendenciaId },
      include: {
        cliente: true,
        pedido: {
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
          },
        },
        pagamentos: {
          include: {
            formaPagamento: true,
            usuario: {
              select: { id: true, nome: true, usuario: true, nivelAcesso: true },
            },
          },
          orderBy: { data: 'desc' },
        },
      },
    })

    if (!pendencia) {
      throw new AppError(
        ERRO_MSG_PENDENCIA.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'PENDENCIA_NOT_FOUND'
      )
    }

    const hoje = new Date()
    const saldoDevedor = Number((pendencia.valor - pendencia.valorPago).toFixed(2))
    const diffMs = hoje.getTime() - new Date(pendencia.dataVencimento).getTime()
    const diasAtraso = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    return {
      ...pendencia,
      saldoDevedor: Math.max(0, saldoDevedor),
      diasAtraso: diasAtraso > 0 ? diasAtraso : 0,
      estaVencida: diasAtraso > 0 && pendencia.status !== 'fechada',
    }
  }
}

export { BuscarPendenciaPorIdServico }

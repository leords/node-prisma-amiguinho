import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class FinalizarCargaServico {
  async executar({ id }) {
    const cargaId = Number(id)
    if (isNaN(cargaId)) {
      throw new AppError(
        ERRO_MSG_CARGA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const carga = await prismaCliente.carga.findUnique({
      where: { id: cargaId },
      include: {
        pedidos: {
          include: {
            formaPagamento: true,
            cliente: true,
          },
        },
      },
    })

    if (!carga) {
      throw new AppError(
        ERRO_MSG_CARGA.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'CARGA_NOT_FOUND'
      )
    }

    const statusCarga = String(carga.status || '').toLowerCase()
    if (statusCarga !== 'pendente') {
      throw new AppError(
        ERRO_MSG_CARGA.CARGA_NAO_PENDENTE,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CARGA_NAO_PENDENTE'
      )
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      // 1. Altera o status da carga para 'rota'
      const cargaAtualizada = await prisma.carga.update({
        where: { id: cargaId },
        data: { status: 'rota' },
      })

      // 2. Altera o status de todos os pedidos da carga para 'carregado'
      await prisma.pedidoExterno.updateMany({
        where: { cargaId: cargaId },
        data: { status: 'carregado' },
      })

      return {
        carga: cargaAtualizada,
        totalPedidosAtualizados: carga.pedidos.length,
      }
    })

    return resultado
  }
}

export { FinalizarCargaServico }

import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CancelarCargaServico {
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
        pedidos: true,
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
        ERRO_MSG_CARGA.CARGA_NAO_PODE_SER_CANCELADA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CARGA_NAO_PENDENTE'
      )
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      // 1. Devolve todos os pedidos vinculados para pendente e desvincula a carga
      const pedidosAtualizados = await prisma.pedidoExterno.updateMany({
        where: {
          cargaId: cargaId,
        },
        data: {
          cargaId: null,
          status: 'pendente',
        },
      })

      // 2. Exclui a carga do banco de dados
      await prisma.carga.delete({
        where: { id: cargaId },
      })

      return {
        totalPedidosLiberados: pedidosAtualizados.count,
      }
    })

    return resultado
  }
}

export { CancelarCargaServico }

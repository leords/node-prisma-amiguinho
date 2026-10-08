import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class RetornarCargaPendenteServico {
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
    })

    if (!carga) {
      throw new AppError(
        ERRO_MSG_CARGA.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'CARGA_NOT_FOUND'
      )
    }

    const statusAtual = String(carga.status || '').toLowerCase()
    if (statusAtual === 'finalizada') {
      throw new AppError(
        ERRO_MSG_CARGA.NAO_PODE_REABRIR_FINALIZADA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'NAO_PODE_REABRIR_FINALIZADA'
      )
    }

    const cargaAtualizada = await prismaCliente.carga.update({
      where: { id: cargaId },
      data: { status: 'pendente' },
      include: {
        veiculo: true,
        motorista: true,
        usuario: {
          select: { id: true, nome: true, usuario: true },
        },
        pedidos: {
          include: {
            cliente: true,
            formaPagamento: true,
            itens: {
              include: {
                produto: true,
              },
            },
          },
        },
      },
    })

    return cargaAtualizada
  }
}

export { RetornarCargaPendenteServico }

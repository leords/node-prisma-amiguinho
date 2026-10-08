import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_MOTORISTA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class EditarMotoristaServico {
  async executar({ id, telefone, status }) {
    const motoristaId = Number(id)
    if (isNaN(motoristaId)) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const motorista = await prismaCliente.motorista.findUnique({
      where: { id: motoristaId },
    })

    if (!motorista) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'MOTORISTA_NOT_FOUND'
      )
    }

    const dadosAtualizacao = {}

    if (telefone !== undefined) {
      dadosAtualizacao.telefone = telefone ? String(telefone).trim() : null
    }

    if (status !== undefined) {
      if (typeof status !== 'boolean') {
        throw new AppError(
          ERRO_MSG_MOTORISTA.TIPO_STATUS,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'TIPO_STATUS'
        )
      }
      dadosAtualizacao.status = status
    }

    const motoristaAtualizado = await prismaCliente.motorista.update({
      where: { id: motoristaId },
      data: dadosAtualizacao,
    })

    return motoristaAtualizado
  }
}

export { EditarMotoristaServico }

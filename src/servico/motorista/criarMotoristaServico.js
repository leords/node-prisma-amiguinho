import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_MOTORISTA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarMotoristaServico {
  async executar({ nome, cpf, telefone }) {
    if (!nome || !cpf) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.CAMPO_AUSENTE,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CAMPO_AUSENTE'
      )
    }

    // Normaliza CPF (somente números se fornecido com pontuação)
    const cpfFormatado = String(cpf).replace(/\D/g, '')

    const motoristaExistente = await prismaCliente.motorista.findUnique({
      where: { cpf: cpfFormatado },
    })

    if (motoristaExistente) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.CPF_JA_EXISTE,
        HTTP_STATUS_CODES.CONFLICT,
        'CPF_JA_EXISTE'
      )
    }

    const motorista = await prismaCliente.motorista.create({
      data: {
        nome: String(nome).trim(),
        cpf: cpfFormatado,
        telefone: telefone ? String(telefone).trim() : null,
      },
    })

    return motorista
  }
}

export { CriarMotoristaServico }

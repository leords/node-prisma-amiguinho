import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_VEICULO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarVeiculoServico {
  async executar({ nome, modelo, marca, placa, pesoMaximo }) {
    if (!nome || !modelo || !marca || !placa) {
      throw new AppError(
        ERRO_MSG_VEICULO.CAMPO_AUSENTE,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CAMPO_AUSENTE'
      )
    }

    const placaFormatada = String(placa).trim().toUpperCase()

    const veiculoExistente = await prismaCliente.veiculo.findUnique({
      where: { placa: placaFormatada },
    })

    if (veiculoExistente) {
      throw new AppError(
        ERRO_MSG_VEICULO.PLACA_JA_EXISTE,
        HTTP_STATUS_CODES.CONFLICT,
        'PLACA_JA_EXISTE'
      )
    }

    const veiculo = await prismaCliente.veiculo.create({
      data: {
        nome: String(nome).trim(),
        modelo: String(modelo).trim(),
        marca: String(marca).trim(),
        placa: placaFormatada,
        pesoMaximo: pesoMaximo ? Number(pesoMaximo) : 0,
      },
    })

    return veiculo
  }
}

export { CriarVeiculoServico }

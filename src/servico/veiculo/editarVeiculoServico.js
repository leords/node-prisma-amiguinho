import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_VEICULO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class EditarVeiculoServico {
  async executar({ id, nome, modelo, marca, placa, pesoMaximo, status, emRota }) {
    const veiculoId = Number(id)
    if (isNaN(veiculoId)) {
      throw new AppError(
        ERRO_MSG_VEICULO.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const veiculo = await prismaCliente.veiculo.findUnique({
      where: { id: veiculoId },
    })

    if (!veiculo) {
      throw new AppError(
        ERRO_MSG_VEICULO.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'VEICULO_NOT_FOUND'
      )
    }

    const dadosAtualizacao = {}

    if (nome !== undefined) dadosAtualizacao.nome = String(nome).trim()
    if (modelo !== undefined) dadosAtualizacao.modelo = String(modelo).trim()
    if (marca !== undefined) dadosAtualizacao.marca = String(marca).trim()

    if (placa !== undefined) {
      const placaFormatada = String(placa).trim().toUpperCase()
      if (placaFormatada !== veiculo.placa) {
        const placaExistente = await prismaCliente.veiculo.findUnique({
          where: { placa: placaFormatada },
        })
        if (placaExistente) {
          throw new AppError(
            ERRO_MSG_VEICULO.PLACA_JA_EXISTE,
            HTTP_STATUS_CODES.CONFLICT,
            'PLACA_JA_EXISTE'
          )
        }
        dadosAtualizacao.placa = placaFormatada
      }
    }

    if (pesoMaximo !== undefined) {
      dadosAtualizacao.pesoMaximo = Number(pesoMaximo)
    }

    if (status !== undefined) {
      if (typeof status !== 'boolean') {
        throw new AppError(
          ERRO_MSG_VEICULO.TIPO_STATUS,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'TIPO_STATUS'
        )
      }
      dadosAtualizacao.status = status
    }

    if (emRota !== undefined) {
      if (typeof emRota !== 'boolean') {
        throw new AppError(
          ERRO_MSG_VEICULO.TIPO_EM_ROTA,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'TIPO_EM_ROTA'
        )
      }
      dadosAtualizacao.emRota = emRota
    }

    const veiculoAtualizado = await prismaCliente.veiculo.update({
      where: { id: veiculoId },
      data: dadosAtualizacao,
    })

    return veiculoAtualizado
  }
}

export { EditarVeiculoServico }

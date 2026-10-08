import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_LOCALIZACAO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class BuscarRotaVendedorServico {
  async executar({ data, usuarioId }) {
    const idUsuario = Number(usuarioId)

    if (!usuarioId || isNaN(idUsuario)) {
      throw new AppError(
        ERRO_MSG_LOCALIZACAO.USUARIO_OBRIGATORIO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'USUARIO_OBRIGATORIO'
      )
    }

    if (!data) {
      throw new AppError(
        ERRO_MSG_LOCALIZACAO.DATA_OBRIGATORIA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'DATA_OBRIGATORIA'
      )
    }

    // Processa a data recebida (suporta 'YYYY-MM-DD' ou ISO string)
    const dataString = String(data).trim().split('T')[0]
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dataRegex.test(dataString)) {
      throw new AppError(
        ERRO_MSG_LOCALIZACAO.FORMATO_DATA_INVALIDO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'FORMATO_DATA_INVALIDO'
      )
    }

    const inicio = new Date(`${dataString}T00:00:00.000`)
    const fim = new Date(`${dataString}T23:59:59.999`)

    const localizacoes = await prismaCliente.localizacao.findMany({
      where: {
        usuarioId: idUsuario,
        data: {
          gte: inicio,
          lte: fim,
        },
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            endereco: true,
            cidade: true,
            telefone: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            usuario: true,
          },
        },
      },
      orderBy: {
        data: 'asc',
      },
    })

    const resultadoComSequencia = localizacoes.map((loc, index) => ({
      sequencia: index + 1,
      id: loc.id,
      uuid: loc.uuid,
      data: loc.data,
      latitude: loc.latitude,
      longitude: loc.longitude,
      precisao: loc.precisao,
      origem: loc.origem,
      cliente: loc.cliente,
      usuario: loc.usuario,
    }))

    return resultadoComSequencia
  }
}

export { BuscarRotaVendedorServico }

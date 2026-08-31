import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { criarLocalizacaoPedidoServico } from '../../servico/localizacao/criarLocalizacaoPedidoServico.js'

class criarLocalizacaoPedidoControlador {
  async tratar(req, res, next) {
    const { localizacoes } = req.body

    //uuid, data, latitude, longitude, precisao, origem, usuarioId, clienteId

    try {
      if (
        !localizacoes ||
        !Array.isArray(localizacoes) ||
        localizacoes.length === 0
      ) {
        throw new AppError(
          'Lista de localizações é obrigatória',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'LISTA_LOCALIZACOES_NOT_FOUND'
        )
      }

      // Converte e valida a tipagem dos campos.
      const listaLocalizacoes = localizacoes.map((localizacao, index) => {
        //convertendo para números;
        const latitude = Number(localizacao.latitude)
        const longitude = Number(localizacao.longitude)
        const precisao = Number(localizacao.precisao)
        const usuarioId = Number(localizacao.usuarioId)
        const clienteId = Number(localizacao.clienteId)

        // validando a tipagem dos dados.

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          throw new AppError(
            'latitude e longitudo são obrigatórios',
            HTTP_STATUS_CODES.BAD_REQUEST,
            'COORDS_NOT_FOUND'
          )
        }

        if (!Number.isFinite(precisao)) {
          throw new AppError(
            'precisão é obrigatório',
            HTTP_STATUS_CODES.BAD_REQUEST,
            'PRECISAO_NOT_FOUND'
          )
        }

        if (!Number.isFinite(usuarioId)) {
          throw new AppError(
            'UsuárioId é obrigatório',
            HTTP_STATUS_CODES.BAD_REQUEST,
            'USUARIO_ID_NOT_FOUND'
          )
        }

        if (!Number.isFinite(clienteId)) {
          throw new AppError(
            'clienteId é obrigatório',
            HTTP_STATUS_CODES.BAD_REQUEST,
            'CLIENTE_ID_NOT_FOUND'
          )
        }

        // retornando o objeto atual e as alterações
        return {
          ...localizacao,
          latitude,
          longitude,
          precisao,
          usuarioId,
          clienteId,
        }
      })

      const servico = new criarLocalizacaoPedidoServico()
      const resultado = await servico.executar(listaLocalizacoes)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}

export { criarLocalizacaoPedidoControlador }

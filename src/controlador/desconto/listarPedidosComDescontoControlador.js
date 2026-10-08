import { ListarPedidosComDescontoServico } from '../../servico/desconto/listarPedidosComDescontoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_DESCONTO,
  ERRO_MSG_DESCONTO,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'

class ListarPedidosComDescontoControlador {
  async tratar(req, res, next) {
    try {
      const {
        setor,
        dataInicio,
        dataFim,
        vendedor,
        cliente,
        clienteId,
        usuarioId,
        status,
      } = req.query

      const setoresValidos = ['balcao', 'delivery', 'externo', 'geral', 'todos']
      if (setor && !setoresValidos.includes(String(setor).toLowerCase().trim())) {
        throw new AppError(
          ERRO_MSG_DESCONTO.SETOR_INVALIDO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'SETOR_INVALIDO'
        )
      }

      const servico = new ListarPedidosComDescontoServico()
      const resultado = await servico.executar({
        setor: setor ? String(setor).toLowerCase().trim() : undefined,
        dataInicio,
        dataFim,
        vendedor,
        cliente,
        clienteId,
        usuarioId,
        status,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_DESCONTO.LISTADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarPedidosComDescontoControlador }

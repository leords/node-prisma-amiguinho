import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { CancelarPedidoServico } from '../../servico/pedido/cancelarPedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class CancelarPedidoControlador {
  async tratar(req, res, next) {
    const { setor } = req.params
    const uuid = req.params.id
    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      if (!setor) {
        throw new AppError(
          "Setor é obrigatório",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SETOR_NOT_FOUND"
        )
      }
      if (!opcoesSetor.includes(setor)) {
        throw new AppError(
          "Setor inválido, opções válidas: delivery, externo e balcao",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SETOR_NOT_FOUND"
        )
      }

      if (!uuid) {
        throw new AppError(
          "ID é obrigatório",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "ID_NOT_FOUND"
        )
      }

      if (typeof uuid !== 'string') {
        throw new AppError(
          "ID deve ser um número",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "ID_NOT_FOUND"
        )
      }

      const servico = new CancelarPedidoServico()
      const resultado = await servico.executar(uuid, setor)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { CancelarPedidoControlador }

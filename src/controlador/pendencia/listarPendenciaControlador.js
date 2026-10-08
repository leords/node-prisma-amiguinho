import { ListarPendenciaServico } from '../../servico/pendencia/listarPendenciaServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class ListarPendenciaControlador {
  async tratar(req, res, next) {
    try {
      const { status, clienteId, diasVencida, pedidoId } = req.query

      const servico = new ListarPendenciaServico()
      const resultado = await servico.executar({
        status,
        clienteId,
        diasVencida,
        pedidoId,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarPendenciaControlador }

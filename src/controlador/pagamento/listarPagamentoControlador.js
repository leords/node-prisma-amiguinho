import { ListarPagamentoServico } from '../../servico/pagamento/listarPagamentoServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class ListarPagamentoControlador {
  async tratar(req, res, next) {
    try {
      const {
        status,
        usuarioId,
        clienteId,
        pedidoId,
        pendenciaId,
        dataInicio,
        dataFim,
      } = req.query

      const servico = new ListarPagamentoServico()
      const resultado = await servico.executar({
        status,
        usuarioId,
        clienteId,
        pedidoId,
        pendenciaId,
        dataInicio,
        dataFim,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarPagamentoControlador }

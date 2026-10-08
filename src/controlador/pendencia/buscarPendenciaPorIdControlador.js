import { BuscarPendenciaPorIdServico } from '../../servico/pendencia/buscarPendenciaPorIdServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class BuscarPendenciaPorIdControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params

      const servico = new BuscarPendenciaPorIdServico()
      const resultado = await servico.executar({ id })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { BuscarPendenciaPorIdControlador }

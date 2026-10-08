import { ListarCargaServico } from '../../servico/carga/listarCargaServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class ListarCargaControlador {
  async tratar(req, res, next) {
    try {
      const { dataInicio, dataFim, veiculoId, motoristaId, status } = req.query

      const servico = new ListarCargaServico()
      const resultado = await servico.executar({
        dataInicio,
        dataFim,
        veiculoId,
        motoristaId,
        status,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarCargaControlador }

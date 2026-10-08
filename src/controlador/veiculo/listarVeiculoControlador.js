import { ListarVeiculoServico } from '../../servico/veiculo/listarVeiculoServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class ListarVeiculoControlador {
  async tratar(req, res, next) {
    try {
      const { status, emRota } = req.query

      const servico = new ListarVeiculoServico()
      const resultado = await servico.executar({ status, emRota })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarVeiculoControlador }

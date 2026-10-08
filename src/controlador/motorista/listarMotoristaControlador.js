import { ListarMotoristaServico } from '../../servico/motorista/listarMotoristaServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class ListarMotoristaControlador {
  async tratar(req, res, next) {
    try {
      const { status } = req.query

      const servico = new ListarMotoristaServico()
      const resultado = await servico.executar({ status })

      return res.status(HTTP_STATUS_CODES.OK).json({
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ListarMotoristaControlador }

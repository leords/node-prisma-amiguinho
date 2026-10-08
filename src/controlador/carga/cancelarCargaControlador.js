import { CancelarCargaServico } from '../../servico/carga/cancelarCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class CancelarCargaControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params

      const servico = new CancelarCargaServico()
      const resultado = await servico.executar({ id })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.CANCELADA,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CancelarCargaControlador }

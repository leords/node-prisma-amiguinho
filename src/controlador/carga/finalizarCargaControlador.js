import { FinalizarCargaServico } from '../../servico/carga/finalizarCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class FinalizarCargaControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params

      const servico = new FinalizarCargaServico()
      const resultado = await servico.executar({ id })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.FINALIZADA,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { FinalizarCargaControlador }

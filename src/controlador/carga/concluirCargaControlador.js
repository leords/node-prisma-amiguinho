import { ConcluirCargaServico } from '../../servico/carga/concluirCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class ConcluirCargaControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params

      const servico = new ConcluirCargaServico()
      const resultado = await servico.executar({ id })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.CONCLUIDA,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ConcluirCargaControlador }

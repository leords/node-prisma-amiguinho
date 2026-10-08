import { RetornarCargaPendenteServico } from '../../servico/carga/retornarCargaPendenteServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class RetornarCargaPendenteControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params

      const servico = new RetornarCargaPendenteServico()
      const resultado = await servico.executar({ id })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.RETORNADA_PENDENTE,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { RetornarCargaPendenteControlador }

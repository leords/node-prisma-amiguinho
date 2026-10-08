import { CriarPendenciaServico } from '../../servico/pendencia/criarPendenciaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PENDENCIA,
} from '../../config/httpStatusCodes.js'

class CriarPendenciaControlador {
  async tratar(req, res, next) {
    try {
      const { clienteId, pedidoId, valor, diasVencimento } = req.body

      const servico = new CriarPendenciaServico()
      const resultado = await servico.executar({
        clienteId,
        pedidoId,
        valor,
        diasVencimento,
      })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_PENDENCIA.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarPendenciaControlador }

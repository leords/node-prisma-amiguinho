import { CriarPagamentoServico } from '../../servico/pagamento/criarPagamentoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PAGAMENTO,
} from '../../config/httpStatusCodes.js'

class CriarPagamentoControlador {
  async tratar(req, res, next) {
    try {
      const { pendenciaId, valor, formaPagamentoId, observacao } = req.body
      const usuarioId = req.user?.id || req.body.usuarioId
      const nivelAcesso = req.user?.nivelAcesso || req.body.nivelAcesso

      const servico = new CriarPagamentoServico()
      const resultado = await servico.executar({
        pendenciaId,
        valor,
        formaPagamentoId,
        observacao,
        usuarioId,
        nivelAcesso,
      })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_PAGAMENTO.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarPagamentoControlador }

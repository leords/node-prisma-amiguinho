import { EditarPagamentoServico } from '../../servico/pagamento/editarPagamentoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PAGAMENTO,
} from '../../config/httpStatusCodes.js'

class EditarPagamentoControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params
      const { valor, status, formaPagamentoId, observacao } = req.body

      const servico = new EditarPagamentoServico()
      const resultado = await servico.executar({
        id,
        valor,
        status,
        formaPagamentoId,
        observacao,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_PAGAMENTO.ATUALIZADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { EditarPagamentoControlador }

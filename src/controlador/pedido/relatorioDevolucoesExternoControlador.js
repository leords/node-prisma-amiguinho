import { RelatorioDevolucoesExternoServico } from '../../servico/pedido/relatorioDevolucoesExternoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PEDIDOS,
} from '../../config/httpStatusCodes.js'

class RelatorioDevolucoesExternoControlador {
  async tratar(req, res, next) {
    try {
      const { dataInicio, dataFim, vendedor } = req.query

      const servico = new RelatorioDevolucoesExternoServico()
      const resultado = await servico.executar({
        dataInicio,
        dataFim,
        vendedor,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_PEDIDOS.RELATORIO_DEVOLUCOES,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { RelatorioDevolucoesExternoControlador }

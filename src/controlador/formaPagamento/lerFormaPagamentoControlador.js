import {
  ERRO_MSG_FORMA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { LerFormaPagamentoServico } from '../../servico/formaPagamento/lerFormaPagamentoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerFormaPagamentoControlador {
  async tratar(req, res) {
    const { status, solicitante } = req.query

    const StatusPossiveis = ['ATIVO', 'INATIVO']

    const possivelSolicitante = ['BALCAO', 'GERAL']

    try {
      if (!status || !StatusPossiveis.includes(status)) {
        throw new Error(ERRO_MSG_FORMA.TIPO_STATUS)
      }
      if (!solicitante || !possivelSolicitante.includes(solicitante)) {
        throw new Error(ERRO_MSG_FORMA.TIPO_SOLICITANTE)
      }

      const servico = new LerFormaPagamentoServico();

      if (solicitante === 'BALCAO') {
        const resultado = await servico.balcao(status)
        return res.status(HTTP_STATUS_CODES.OK).json(resultado)
      }
      if (solicitante === 'GERAL') {
        const resultado = await servico.geral(status)
        return res.status(HTTP_STATUS_CODES.OK).json(resultado)
      }
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { LerFormaPagamentoControlador }

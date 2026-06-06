import {
  ERRO_MSG_FORMA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { LerFormaPagamentoServico } from '../../servico/formaPagamento/lerFormaPagamentoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerFormaPagamentoBalcaoControlador {
  async tratar(req, res, next) {
    const { status, solicitante } = req.query

    const StatusPossiveis = ['ATIVO', 'INATIVO']

    try {
      if (!status || !StatusPossiveis.includes(status)) {
        throw new Error(ERRO_MSG_FORMA.TIPO_STATUS)

        throw new AppError(
          ERRO_MSG_FORMA.TIPO_STATUS,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "STATUS_BAD_REQUEST"
        )
      }


      const servico = new LerFormaPagamentoServico();
      const resultado = await servico.balcao(status)
      return res.status(HTTP_STATUS_CODES.OK).json(resultado)

      }
  
     catch (error) {
      console.log(error)
      next(error)
    }
  }

}

export { LerFormaPagamentoBalcaoControlador }

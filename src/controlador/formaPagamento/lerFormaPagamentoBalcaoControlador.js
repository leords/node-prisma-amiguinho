import {
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { LerFormaPagamentoServico } from '../../servico/formaPagamento/lerFormaPagamentoServico.js'

class LerFormaPagamentoBalcaoControlador {
  async tratar(req, res, next) {
    const servico = new LerFormaPagamentoServico()
    const resultado = await servico.balcao()
    return res.status(HTTP_STATUS_CODES.OK).json(resultado)
  }
  catch(error) {
    console.log(error)
    next(error)
  }
}

export { LerFormaPagamentoBalcaoControlador }

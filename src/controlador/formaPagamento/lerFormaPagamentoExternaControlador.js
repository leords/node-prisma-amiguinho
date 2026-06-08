import {
  ERRO_MSG_FORMA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { LerFormaPagamentoServico } from '../../servico/formaPagamento/lerFormaPagamentoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerFormaPagamentoExternaControlador {
  async tratar(req, res, next) {

      const servico = new LerFormaPagamentoServico();
      const resultado = await servico.externa(status)
      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
      

    } catch (error) {
      console.log(error)
      next(error)
    }
  }

export { LerFormaPagamentoExternaControlador }

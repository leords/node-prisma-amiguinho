import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { BuscarFechamentoBalcaoDiaServico } from '../../servico/pedido/buscarFechamentoBalcaoDiaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { AppError } from "../../error/appError.js"

class BuscarFechamentoBalcaoDiaControlador {
  async tratar(req, res, next) {
    const { data, vendedor } = req.query

    try {
      if (!data) {
        throw new AppError(
          "data é obrigatória",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_NOT_FOUND"
        )
      }
      if (typeof data !== 'string') {
        throw new AppError(
          "data deve ser tipo texto",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_NOT_FOUND"
        )
      }
      if (!vendedor) {
        throw new AppError(
          "vendedor obrigatório",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_NOT_FOUND"
        )
      }
      if (typeof vendedor !== 'string') {
        throw new AppError(
          "vendedor deve ser tipo texto",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_NOT_FOUND"
        )
      }

      const opcoesVendedor = ['b1', 'b2', 'b3']
      if (!opcoesVendedor.includes(vendedor)) {
        throw new AppError(
          "Vendedor inválido, deve ser b1, b2 ou b3",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_ID_NOT_FOUND"
        )
      }

      const inicio = data ? new Date(`${data}T00:00:00-03:00`) : undefined
      const fim = data ? new Date(`${data}T23:59:59.999-03:00`) : undefined

      const servico = new BuscarFechamentoBalcaoDiaServico()
      const resultado = await servico.executar(inicio, fim, vendedor)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { BuscarFechamentoBalcaoDiaControlador }

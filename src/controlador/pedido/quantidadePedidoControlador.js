import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { QuantidadePedidoServico } from '../../servico/pedido/quantidadePedido/quantidadePedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class QuantidadePedidoControlador {
  async tratar(req, res) {
    const { setor } = req.params
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined


    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao', 'geral']
      if (!setor) {
        throw new AppError(
          'Setor é obrigatório',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }
      if (!opcoesSetor.includes(setor)) {
                throw new AppError(
          'Setor inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new AppError(
          'Vendedor deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }
      if (!dataInicio && !dataFim) {
        throw new AppError(
          'Data de início e fim são obrigatórios',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }
      if (dataInicio && typeof dataInicio !== 'string') {
        throw new AppError(
          'Data de início deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }
      if (dataFim && typeof dataFim !== 'string') {
        throw new AppError(
          'Data de fim deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_FIM_NOT_FOUND"
        )
      }

      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

      const servico = new QuantidadePedidoServico()
      const resultado = await servico.executar(setor, vendedor, inicio, fim)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { QuantidadePedidoControlador }

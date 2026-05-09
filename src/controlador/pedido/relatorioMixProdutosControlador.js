import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { RelatorioMixProdutosServico } from '../../servico/pedido/relatorioMixProdutos/relatorioMixProdutosServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class RelatorioMixProdutosControlador {
  async tratar(req, res, next) {
    const setor = req.params.setor ? req.params.setor : undefined
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined
    const dataInicio = req.query.data ? req.query.data : undefined
    const dataFim = req.query.data ? req.query.data : undefined

    try {
      
      const opcoesSetor = ['delivery', 'externo', 'balcao', 'geral']

      if (setor && typeof setor !== 'string' && !opcoesSetor.includes(setor)) {
        throw new AppError(
          'Setor inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SETOR_NOT_FOUND"
        )
      }

      if(vendedor && typeof vendedor !== 'string') {
        throw new AppError(
          'Vendedor inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_NOT_FOUND"
        )
      }

      if (dataInicio && typeof dataInicio !== 'string') {
        throw new AppError(
          'Data inválida',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_NOT_FOUND"
        )
      }

      if (dataFim && typeof dataFim !== 'string') {
        throw new AppError(
          'Data inválida',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_FIM_NOT_FOUND"
        )
      }

      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

      const servico = new RelatorioMixProdutosServico()
      const resultado = await servico.executar(setor, vendedor, inicio, fim)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { RelatorioMixProdutosControlador }

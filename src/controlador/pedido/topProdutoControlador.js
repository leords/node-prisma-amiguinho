import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { TopProdutosServico } from '../../servico/pedido/topProdutosServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class TopProdutoControlador {
  async tratar(req, res, next) {
    const { setor } = req.params
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined
    const quantidade = req.query.quantidade
      ? Number(req.query.quantidade)
      : undefined

    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      if (!setor) {
        throw new AppError(
          'Setor é obrigatório',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_FIM_NOT_FOUND"
        )
      }

      if (!opcoesSetor.includes(setor)) {
        throw new AppError(
          'Setor inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_FIM_NOT_FOUND"
        )
      }

      if (vendedor && typeof vendedor !== 'string') {
        throw new AppError(
          'Vendedor deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_NOT_FOUND"
        )
      }

      if (!dataInicio && !dataFim) {
        throw new AppError(
          'Data de início e fim são obrigatórios',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_NOT_FOUND"
        )
      }

      if (dataInicio && typeof dataInicio !== 'string') {
        throw new AppError(
          'Data de início deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_INICIO_NOT_FOUND"
        )
      }

      if (dataFim && typeof dataFim !== 'string') {
        throw new AppError(
          'Data de fim deve ser texto',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_FIM_NOT_FOUND"
        )
      }

      if (quantidade && quantidade <= 0) {
        throw new AppError(
          'Quantidade deve ser maior que 0',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "QUANTIDADE_NOT_FOUND"
        )
      }

      if (!quantidade) {
        throw new AppError(
          'Quantidade é obrigatória',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "QUANTIDADE_NOT_FOUND"
        )
      }

      if (isNaN(quantidade)) {
        throw new AppError(
          'Quantidade deve ser um número',
          HTTP_STATUS_CODES.BAD_REQUEST,
          "QUANTIDADE_NOT_FOUND"
        )
      }

      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined
      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined

      const servico = new TopProdutosServico()
      const resultado = await servico.executar(
        setor,
        inicio,
        fim,
        vendedor,
        quantidade
      )

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log('erro no controlador: ', error)
      next(error)
    }
  }
}

export { TopProdutoControlador }

import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { DeletarMovimentacaoPagamentosEletronicosServico } from '../../servico/movimentacaoPagamentosEletronicos/deletarMovimentacaoPagamentosEletronicosServico.js'

class DeletarMovimentacaoPagamentosEletronicosControlador {
  async tratar(req, res, next) {
    const id = Number(req.params.id)

    try {
      if (!id) {
        throw new AppError(
          'Fechamento ID é obrigatório',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'FECHAMENTO_ID_NOT_FOUND'
        )
      }

      if (isNaN(id)) {
        throw new AppError(
          'Fechamento ID deve ser um número',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'FECHAMENTO_ID_NOT_FOUND'
        )
      }

      const resultado = new DeletarMovimentacaoPagamentosEletronicosServico()
      const servico = await resultado.executar(id)

      return res.status(HTTP_STATUS_CODES.OK).json(servico)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { DeletarMovimentacaoPagamentosEletronicosControlador }

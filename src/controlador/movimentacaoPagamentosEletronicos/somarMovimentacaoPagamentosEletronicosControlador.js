import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { AppError } from '../../error/appError.js'
import { SomarMovimentacaoPagamentosEletronicosServico } from '../../servico/movimentacaoPagamentosEletronicos/somarMovimentacaoPagamentosEletronicosServico.js'

class SomarMovimentacaoPagamentosEletronicosControlador {
  async tratar(req, res, next) {
    const fechamentoId = Number(req.params.fechamentoId)

    try {
      if (!fechamentoId) {
        throw new AppError(
          "'Fechamento ID é obrigatório",
          HTTP_STATUS_CODES.BAD_REQUEST,
          'FECHAMENTO_ID_NOT_FOUND'
        )
      }
      if (isNaN(fechamentoId)) {
        throw new AppError(
          'Fechamento ID deve ser um número',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'FECHAMENTO_ID_NOT_FOUND'
        )
      }

      const resultado = new SomarMovimentacaoPagamentosEletronicosServico()
      const servico = await resultado.executar(fechamentoId)

      return res.status(HTTP_STATUS_CODES.OK).json(servico)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { SomarMovimentacaoPagamentosEletronicosControlador }

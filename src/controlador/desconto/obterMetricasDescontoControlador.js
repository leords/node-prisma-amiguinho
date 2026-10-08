import { ObterMetricasDescontoServico } from '../../servico/desconto/obterMetricasDescontoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_DESCONTO,
  ERRO_MSG_DESCONTO,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'

class ObterMetricasDescontoControlador {
  async tratar(req, res, next) {
    try {
      const {
        setor,
        dataInicio,
        dataFim,
        vendedor,
        cliente,
        usuarioId,
        status,
      } = req.query

      const setoresValidos = ['balcao', 'delivery', 'externo', 'geral', 'todos']
      if (setor && !setoresValidos.includes(String(setor).toLowerCase().trim())) {
        throw new AppError(
          ERRO_MSG_DESCONTO.SETOR_INVALIDO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          'SETOR_INVALIDO'
        )
      }

      const servico = new ObterMetricasDescontoServico()
      const resultado = await servico.executar({
        setor: setor ? String(setor).toLowerCase().trim() : undefined,
        dataInicio,
        dataFim,
        vendedor,
        cliente,
        usuarioId,
        status,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_DESCONTO.METRICAS,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ObterMetricasDescontoControlador }

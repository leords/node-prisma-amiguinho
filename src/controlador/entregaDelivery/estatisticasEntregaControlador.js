import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { EstatisticasEntregaServico } from '../../servico/entregaDelivery/estatisticasEntregaServico.js'
import { AppError } from '../../error/appError.js'

class estatisticasEntregaControlador {
  async tratar(req, res, next) {
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined

    console.log('data inicio: ', dataInicio)
    console.log('tipo data inicio: ', typeof dataInicio)
    console.log('data fim: ', dataFim)
    console.log('tipo data fim: ', typeof dataFim)

    try {
      if (!dataInicio) {
        throw new AppError(
          'Data de início é obrigatório',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'DATA_INICIO_BAD_REQUEST'
        )
      }
      if (!dataFim) {
        throw new AppError(
          'Data de fim é obrigatório',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'DATA_FIM_BAD_REQUEST'
        )
      }

      const inicio = dataInicio
        ? new Date(`${dataInicio}T00:00:00-03:00`)
        : undefined
      const fim = dataFim
        ? new Date(`${dataFim}T23:59:59.999-03:00`)
        : undefined

      const servico = new EstatisticasEntregaServico()
      const resultado = await servico.executar(inicio, fim)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
    }
  }
}

export { estatisticasEntregaControlador }

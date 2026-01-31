import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { LinhaTemporalServico } from '../../servico/pedido/linhaTemporalServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LinhaTemporalControlador {
  async tratar(req, res) {
    const { setor } = req.params
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined

    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      if (!setor) {
        throw new Error('Setor é obrigatório')
      }
      if (!opcoesSetor.includes(setor)) {
        throw new Error('Setor inválido')
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new Error('Vendedor deve ser texto')
      }
      if (!dataInicio && !dataFim) {
        throw new Error('Data de início e fim são obrigatórios')
      }
      if (dataInicio && typeof dataInicio !== 'string') {
        throw new Error('Data de início deve ser texto')
      }
      if (dataFim && typeof dataFim !== 'string') {
        throw new Error('Data de fim deve ser texto')
      }

      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

      const servico = new LinhaTemporalServico()
      const resultado = await servico.executar(setor, inicio, fim, vendedor)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { LinhaTemporalControlador }

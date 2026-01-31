import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { TicketMedioServico } from '../../servico/pedido/ticketMedioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class TicketMedioControlador {
  async tratar(req, res) {
    const setor = req.params.setor ? req.params.setor : undefined
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined

    console.log('Setor ainda no controlador: ', setor)

    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      if (setor && typeof setor !== 'string' && !opcoesSetor.includes(setor)) {
        throw new Error('Setor inválido')
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new Error('Vendedor inválido')
      }
      if (dataInicio && typeof dataInicio !== 'string') {
        throw new Error('Data inválida')
      }
      if (dataFim && typeof dataFim !== 'string') {
        throw new Error('Data inválida')
      }


      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined


      const servico = new TicketMedioServico()
      const resultado = await servico.executar(
        setor,
        vendedor,
        inicio,
        fim
      )

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { mensagem, status } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { TicketMedioControlador }

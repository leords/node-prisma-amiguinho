import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { TicketMedioServico } from '../../servico/pedido/ticketMedioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class TicketMedioControlador {
  async tratar(req, res) {
    const setor = req.params.setor ? req.params.setor : undefined
    const vendedor = req.params.vendedor ? req.params.vendedor : undefined
    const dataInicio = req.params.data ? req.params.data : undefined
    const dataFim = req.params.data ? req.params.data : undefined

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

      const servico = new TicketMedioServico()
      const resultado = await servico.executar(
        setor,
        vendedor,
        dataInicio,
        dataFim
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

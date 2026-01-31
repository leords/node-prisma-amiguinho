import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { BuscarFechamentoBalcaoDiaServico } from '../../servico/pedido/buscarFechamentoBalcaoDiaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarFechamentoBalcaoDiaControlador {
  async tratar(req, res) {
    const { data, vendedor } = req.query

    try {
      if (!data) {
        throw new Error('data é obrigatória')
      }
      if (typeof data !== 'string') {
        throw new Error('data deve ser tipo texto')
      }
      if (!vendedor) {
        throw new Error('vendedor obrigatório')
      }
      if (typeof vendedor !== 'string') {
        throw new Error('vendedor deve ser tipo texto')
      }

      const opcoesVendedor = ['b1', 'b2', 'b3']
      if (!opcoesVendedor.includes(vendedor)) {
        throw new Error('Vendedor inválido, deve ser b1, b2 ou b3')
      }

      const inicio = data ? new Date(`${data}T00:00:00-03:00`) : undefined
      const fim = data ? new Date(`${data}T23:59:59.999-03:00`) : undefined

      const servico = new BuscarFechamentoBalcaoDiaServico()
      const resultado = await servico.executar(inicio, fim, vendedor)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { BuscarFechamentoBalcaoDiaControlador }

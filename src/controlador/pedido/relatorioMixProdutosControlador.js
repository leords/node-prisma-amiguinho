import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { RelatorioMixProdutosServico } from '../../servico/pedido/relatorioMixProdutosServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class RelatorioMixProdutosControlador {
  async tratar(req, res) {
    try {
      const servico = new RelatorioMixProdutosServico()
      const resultado = await servico.executar()

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { mensagem, status } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { RelatorioMixProdutosControlador }

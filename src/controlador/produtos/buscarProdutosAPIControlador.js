import {
  ERRO_MSG_PRODUTO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PRODUTO,
} from '../../config/httpStatusCodes.js'
import { BuscarProdutosAPIServico } from '../../servico/produtos/buscarProdutosAPIServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarProdutosAPIControlador {
  async tratar(req, res) {
    try {
      const resposta = await fetch(
        'https://script.google.com/macros/s/AKfycby0sRecjBmrq-Odpt4K2lSIS18NX-569Lf7Axh9fVxZoIRMu3DxTnDDoOUFLpS9RIOXag/exec'
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(`Erro na coleta de produtos: ${resposta.status}`)
      }
      if (!dados || !dados.saida) {
        throw new Error(ERRO_MSG_PRODUTO.SINCRONIZACAO)
      }

      const servico = new BuscarProdutosAPIServico()
      await servico.executar(dados.saida)

      return res
        .status(HTTP_STATUS_CODES.OK)
        .json(SUCESSO_MSG_PRODUTO.SINCRONIZACAO)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json(mensagem)
    }
  }
}

export { BuscarProdutosAPIControlador }

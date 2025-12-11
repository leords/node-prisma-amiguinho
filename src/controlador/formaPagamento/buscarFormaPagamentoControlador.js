import {
  ERRO_MSG_FORMA,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_FORMA,
} from '../../config/httpStatusCodes.js'
import { BuscarFormaPagamentoServico } from '../../servico/formaPagamento/buscarFormaPagamentoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarFormaPagamentControlador {
  async tratar(req, res) {
    try {
      const resposta = await fetch(
        'https://script.google.com/macros/s/AKfycbx3kBxwZz_gHH90urwxksgyfLmw5h3FBDxD4-ufxa2DkvZg83aJaelWgqVuKftq9L8p0g/exec'
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(`Erro na coleta de produtos: ${resposta.status}`)
      }
      if (!dados || !dados.saida) {
        throw new Error(ERRO_MSG_FORMA.SINCRONIZACAO)
      }

      const servico = new BuscarFormaPagamentoServico()
      await servico.executar(dados.saida)

      return res
        .status(HTTP_STATUS_CODES.OK)
        .json(SUCESSO_MSG_FORMA.SINCRONIZACAO)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { BuscarFormaPagamentControlador }

import {
  ERRO_MSG_CLIENTE_EXTERNO,
  SUCESSO_MSG_CLIENTE_EXTERNO,
} from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { BuscarClienteExternoServico } from '../../servico/clienteExterno/buscarClienteExternoServico.js'

class BuscarClienteExternoControlador {
  async tratar(req, res) {
    try {
      // DEPOIS USAR .ENV PARA A URL DO GOOGLE SHEET
      const resposta = await fetch(
        'https://script.google.com/macros/s/AKfycbyCzg47M3MRq6xFYxkeacXHhtW6JKdVGijiMbIXgcbGeHWkt_xI26_SYsXejmANQO04/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'externa',
          }),
        }
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          `Erro na coleta de clientes externos: ${resposta.status}`
        )
      }

      if (!dados || !dados.saida) {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.ERRO_SINCRONIZACAO)
      }

      const servico = new BuscarClienteExternoServico()
      await servico.executar(dados.saida)

      return res.status(HTTP_STATUS_CODES.OK).json({
        message: SUCESSO_MSG_CLIENTE_EXTERNO.SUCESSO_SINCRONIZACAO,
      })
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { BuscarClienteExternoControlador }

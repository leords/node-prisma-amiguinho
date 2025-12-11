import {
  ERRO_MSG_CLIENTE_DELIVERY,
  SUCESSO_MSG_CLIENTE_DELIVERY,
} from '../../config/httpStatusCodes.js'
import { BuscarClienteDeliveryServico } from '../../servico/clienteDelivery/buscarClienteDeliveryServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'

class BuscarCLienteDeliveryControlador {
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
            action: 'delivery',
          }),
        }
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(`Erro na coleta clientes delivery: ${resposta.status}`)
      }

      if (!dados || !dados.saida) {
        throw new Error(ERRO_MSG_CLIENTE_DELIVERY.ERRO_SINCRONIZACAO)
      }

      const servico = new BuscarClienteDeliveryServico()
      await servico.executar(dados.saida)

      return res.status(HTTP_STATUS_CODES.OK).json({
        message: SUCESSO_MSG_CLIENTE_DELIVERY.SINCRONIZACAO,
      })
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { BuscarCLienteDeliveryControlador }

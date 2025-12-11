import {
  ERRO_MSG_CLIENTE_DELIVERY,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { LerClienteDeliveryServico } from '../../servico/clienteDelivery/lerClienteDeliveryServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerClienteDeliveryControlador {
  async tratar(req, res) {
    const id = req.query.id ? Number(req.query.id) : undefined
    const nome = req.query.nome ? req.query.nome : undefined
    const cidade = req.query.cidade ? req.query.cidade : undefined
    const bairro = req.query.bairro ? req.query.bairro : undefined

    try {
      if (id && isNaN(id)) {
        throw new Error(ERRO_MSG_CLIENTE_DELIVERY.TIPO_ID)
      }
      if (nome && typeof nome !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_DELIVERY.TIPO_NOME)
      }
      if (cidade && typeof cidade !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_DELIVERY.TIPO_CIDADE)
      }
      if (bairro && typeof bairro !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_DELIVERY.TIPO_BAIRRO)
      }

      const filtros = {
        id: id,
        nome: nome,
        cidade: cidade,
        bairro: bairro,
      }

      const servico = new LerClienteDeliveryServico()
      const resultado = await servico.executar(filtros)

      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { LerClienteDeliveryControlador }

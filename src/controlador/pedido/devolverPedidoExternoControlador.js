import { DevolverPedidoExternoServico } from '../../servico/pedido/devolverPedidoExternoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PEDIDOS,
} from '../../config/httpStatusCodes.js'

class DevolverPedidoExternoControlador {
  async tratar(req, res, next) {
    try {
      const identificador = req.params.id || req.params.uuid || req.body.identificador

      const servico = new DevolverPedidoExternoServico()
      const resultado = await servico.executar({ identificador })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_PEDIDOS.DEVOLVIDO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { DevolverPedidoExternoControlador }

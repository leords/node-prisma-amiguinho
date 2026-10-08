import { RemoverPedidoCargaServico } from '../../servico/carga/removerPedidoCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class RemoverPedidoCargaControlador {
  async tratar(req, res, next) {
    try {
      const { cargaId, pedidoId } = req.params

      const servico = new RemoverPedidoCargaServico()
      const resultado = await servico.executar({ cargaId, pedidoId })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.PEDIDO_REMOVIDO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { RemoverPedidoCargaControlador }

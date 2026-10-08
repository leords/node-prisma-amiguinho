import { AdicionarPedidosCargaServico } from '../../servico/carga/adicionarPedidosCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class AdicionarPedidosCargaControlador {
  async tratar(req, res, next) {
    try {
      const { cargaId } = req.params
      const { pedidosIds } = req.body

      const servico = new AdicionarPedidosCargaServico()
      const resultado = await servico.executar({ cargaId, pedidosIds })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_CARGA.PEDIDOS_ADICIONADOS,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { AdicionarPedidosCargaControlador }

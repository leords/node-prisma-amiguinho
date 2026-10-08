import { BuscarRotaVendedorServico } from '../../servico/localizacao/buscarRotaVendedorServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_LOCALIZACAO,
} from '../../config/httpStatusCodes.js'

class BuscarRotaVendedorControlador {
  async tratar(req, res, next) {
    try {
      const data = req.query.data || req.body?.data
      const usuarioId = req.query.usuarioId || req.body?.usuarioId

      const servico = new BuscarRotaVendedorServico()
      const resultado = await servico.executar({ data, usuarioId })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_LOCALIZACAO.LISTADO,
        total: resultado.length,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { BuscarRotaVendedorControlador }

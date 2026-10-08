import { CriarCargaServico } from '../../servico/carga/criarCargaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CARGA,
} from '../../config/httpStatusCodes.js'

class CriarCargaControlador {
  async tratar(req, res, next) {
    try {
      const { veiculoId, motoristaId, descricao, destino, pedidosIds } =
        req.body
      const usuarioId = req.user?.id || req.body.usuarioId

      const servico = new CriarCargaServico()
      const resultado = await servico.executar({
        veiculoId,
        motoristaId,
        descricao,
        destino,
        pedidosIds,
        usuarioId,
      })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_CARGA.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarCargaControlador }

import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { ListarUsuarioServico } from '../../servico/usuario/ListarUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ListarUsuarioControlador {
  async tratar(req, res) {
    try {
      const servico = new ListarUsuarioServico()
      const resultado = await servico.executar()

      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { ListarUsuarioControlador }

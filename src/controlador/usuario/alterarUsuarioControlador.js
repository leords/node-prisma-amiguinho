import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AlterarUsuarioServico } from '../../servico/usuario/alterarUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class AlterarUsuarioControlador {
  async tratar(req, res) {
    const { id } = req.body

    try {
      if (!id) {
        throw new Error(ERRO_MSG_USUARIO.ID_VAZIO)
      }
      if (isNaN(id)) {
        throw new Error(ERRO_MSG_USUARIO.TIPO_ID)
      }

      const servico = new AlterarUsuarioServico(id)
      const resultado = await servico.executar(id)

      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { AlterarUsuarioControlador }

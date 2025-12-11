import { AutenticadorServico } from '../../auth/autenticadorServico.js'
import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LoginUsuario {
  async tratar(req, res) {
    const { usuario, senha } = req.body

    try {
      if (!usuario || typeof usuario !== 'string') {
        throw new Error(ERRO_MSG_USUARIO.TIPO_NOME)
      }

      if (!senha || typeof senha !== 'string') {
        throw new Error(ERRO_MSG_USUARIO.TIPO_SENHA)
      }

      const servico = new AutenticadorServico()
      const resultado = await servico.login(usuario, senha)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ error: mensagem })
    }
  }
}

export { LoginUsuario }

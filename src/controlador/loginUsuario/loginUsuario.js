import { AutenticadorServico } from '../../auth/autenticadorServico.js'
import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LoginUsuario {
  async tratar(req, res, next) {
    const { usuario, senha } = req.body

    try {
      if (!usuario || typeof usuario !== 'string') {
        throw new AppError(
          "Usuário é obrigatório e deve ser do tipo texto",
          401,
          "USUARIO_INVALIDO"
      )
      }

      if (!senha || typeof senha !== 'string') {
        throw new AppError(
          "Senha é obrigatória e deve ser do tipo texto",
          401,
          "USUARIO_INVALIDO"
      )
      }

      const servico = new AutenticadorServico()
      const resultado = await servico.login(usuario, senha)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { LoginUsuario }

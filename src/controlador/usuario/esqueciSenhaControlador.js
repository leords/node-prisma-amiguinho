import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { EsqueciSenhaServico } from '../../servico/usuario/esqueciSenhaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class EsqueciSenhaControlador {
  async tratar(req, res, next) {
    try {
      const { email } = req.body


      if (!email) {

        throw new AppError(
          ERRO_MSG_USUARIO.EMAIL_OBRIGADOTORIO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "EMAIL_BAD_REQUEST"
        )
      }

      const servico = new EsqueciSenhaServico()
      await servico.executar(email)

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_USUARIO.VALIDAR_ENVIO_EMAIL,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { EsqueciSenhaControlador }

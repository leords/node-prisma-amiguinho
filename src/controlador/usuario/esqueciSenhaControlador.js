import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { EsqueciSenhaServico } from '../../servico/usuario/esqueciSenhaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class EsqueciSenhaControlador {
  async tratar(req, res) {
    try {
      const { email } = req.body

      // Checagem simples de entrada
      if (!email) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ mensagem: ERRO_MSG_USUARIO.EMAIL_OBRIGADOTORIO })
      }

      const servico = new EsqueciSenhaServico()
      await servico.executar(email)

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_USUARIO.VALIDAR_ENVIO_EMAIL,
      })
    } catch (error) {
      console.error('EsqueciSenhaController.esqueciSenha =>', error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { EsqueciSenhaControlador }

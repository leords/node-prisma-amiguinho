import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { ResetarSenhaServico } from '../../servico/usuario/resetarSenhaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ResetarSenhaControlador {
  async tratar(req, res) {
    try {
      const { token, novaSenha } = req.body

      if (!token || !novaSenha) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: ERRO_MSG_USUARIO.TOKEN_SENHA_OBRIGATORIOS })
      }

      const servico = new ResetarSenhaServico()
      await servico.executar(token, novaSenha)

      return res
        .status(HTTP_STATUS_CODES.OK)
        .json({ mensagem: SUCESSO_MSG_USUARIO.SENHA_REDEFINIDA })
    } catch (error) {
      console.error('EsqueciSenhaController.resetarSenha =>', error)

      const { status, mensagem } = coletarErro(error)

      return res.status(status).json({ mensagem })
    }
  }
}

export { ResetarSenhaControlador }

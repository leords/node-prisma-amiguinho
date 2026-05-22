import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { ResetarSenhaServico } from '../../servico/usuario/resetarSenhaServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ResetarSenhaControlador {
  async tratar(req, res, next) {
    try {
      const { token, novaSenha } = req.body

      console.log('Debug TOKEN: ', token)
      console.log('Debug NOVA SENHA: ', novaSenha)

      if (!token || !novaSenha) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: ERRO_MSG_USUARIO.TOKEN_SENHA_OBRIGATORIOS })
      }

      const servico = new ResetarSenhaServico()
      const retorno = await servico.executar(token, novaSenha)

      return retorno
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}

export { ResetarSenhaControlador }

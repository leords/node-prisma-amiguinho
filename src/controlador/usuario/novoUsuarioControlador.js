import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { NovoUsuarioServico } from '../../servico/usuario/novoUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class NovoUsuarioControlador {
  async tratar(req, res) {
    try {
      const { nome, email, usuario, senha, nivelAcessoId } = req.body

      if (!nome || !email || !usuario || !senha || !nivelAcessoId) {
        throw new Error(ERRO_MSG_USUARIO.CAMPO_AUSENTE)
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error(ERRO_MSG_USUARIO.VALIDAR_EMAIL)
      }

      if (typeof nome !== 'string') {
        throw new Error(ERRO_MSG_USUARIO.TIPO_NOME)
      }

      if (typeof usuario !== 'string') {
        throw new Error(ERRO_MSG_USUARIO.TIPO_USUARIO)
      }

      if (typeof senha !== 'string') {
        throw new Error(ERRO_MSG_USUARIO.TIPO_SENHA)
      }

      if (!senha.length == 6) {
        throw new Error(ERRO_MSG_USUARIO.VALIDAR_SENHA)
      }
      if (!nivelAcessoId) {
        throw new Error(ERRO_MSG_USUARIO.TIPO_NIVEL_ACESSO)
      }

      if (nivelAcessoId < 1 || nivelAcessoId > 5) {
        throw new Error(ERRO_MSG_USUARIO.OPCAO_NIVEL_ACESSO)
      }

      const servico = new NovoUsuarioServico()
      const resultado = await servico.executar(
        nome,
        email,
        usuario,
        senha,
        nivelAcessoId
      )

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        message: SUCESSO_MSG_USUARIO.CRIAR_USUARIO,
        usuario: resultado,
      })
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ error: mensagem })
    }
  }
}

export { NovoUsuarioControlador }

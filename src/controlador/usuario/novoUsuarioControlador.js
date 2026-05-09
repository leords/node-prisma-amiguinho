import { NivelAcesso } from '@prisma/client'
import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_USUARIO,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { NovoUsuarioServico } from '../../servico/usuario/novoUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class NovoUsuarioControlador {
  async tratar(req, res, next) {

    try {
      const { nome, email, usuario, senha, whatsapp, nivelAcesso } = req.body

      console.log('Dados da req: ', nome, email, usuario, senha, nivelAcesso, whatsapp )

      if (!nome || !email || !usuario || !senha || !nivelAcesso) {
        throw new Error(ERRO_MSG_USUARIO.CAMPO_AUSENTE)
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new AppError(
          ERRO_MSG_USUARIO.VALIDAR_EMAIL,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "EMAIL_NOT_FOUND"
        )
      }

      if (typeof nome !== 'string') {
        throw new AppError(
          ERRO_MSG_USUARIO.TIPO_NOME,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "NOME_NOT_FOUND"
        )
      }

      if (typeof usuario !== 'string') {
        throw new AppError(
          ERRO_MSG_USUARIO.TIPO_USUARIO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "USUARIO_NOT_FOUND"
        )
      }

      if (typeof senha !== 'string') {
        throw new AppError(
          ERRO_MSG_USUARIO.TIPO_SENHA,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SENHA_NOT_FOUND"
        )
      }

      if (!senha.length == 6) {
        throw new AppError(
          ERRO_MSG_USUARIO.VALIDAR_SENHA,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SENHA_NOT_FOUND"
        )
      }
      
      if (!nivelAcesso) {
        throw new AppError(
          ERRO_MSG_USUARIO.TIPO_NIVEL_ACESSO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "NIVEL_DE_ACESSO_NOT_FOUND"
        )
      }

      const opcoesNivelAcesso = ["ADMIN", "VENDAS", "BALCAO", "DELIVERY", "EXTERNO", "USUARIO"]

      if (!opcoesNivelAcesso.includes(nivelAcesso)) {
        throw new AppError(
          ERRO_MSG_USUARIO.OPCAO_NIVEL_ACESSO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "NIVEL_DE_ACESSO_NOT_FOUND"
        )
      }

      if (typeof whatsapp !== 'string') {
        throw new AppError(
          "Whatsapp precisa ser do tipo texto",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "WHATSAPP_NOT_FOUND"
        )
      }

      const servico = new NovoUsuarioServico()
      const resultado = await servico.executar(
        nome,
        email,
        usuario,
        senha,
        whatsapp,
        nivelAcesso
      )

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        message: SUCESSO_MSG_USUARIO.CRIAR_USUARIO,
        usuario: resultado,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { NovoUsuarioControlador }

import {
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { AlterarUsuarioServico } from '../../servico/usuario/alterarUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class AlterarUsuarioControlador {
  async tratar(req, res, next) {


    const id = Number(req.params.id)
    const { status, nivelAcesso } = req.body

    const statusValidado = status === 'ATIVO'


    try {
      if(!id) {
        throw new AppError(
          ERRO_MSG_USUARIO.ID_VAZIO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "ID_NOT_FOUND"
        )
      }

      if(isNaN(id)) {
        throw new AppError(
          ERRO_MSG_USUARIO.TIPO_ID,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "ID_NOT_FOUND"
        )
      }

      if(statusValidado && typeof statusValidado !== 'boolean') {
          throw new AppError(
          "Status deve ser do tipo texto",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "STATUS_NOT_FOUND"
          )
      }

      if(nivelAcesso && typeof nivelAcesso !== 'string') {
        throw new AppError(
          "Nivel de acesso deve ser do tipo texto",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "NIVEL_ACESSO_NOT_FOUND"
        )
      }

      const opcoesNivelAcesso = ['ADMIN', 'VENDAS', 'BALCAO', 'DELIVERY', 'EXTERNO', 'USUARIO']

      if(nivelAcesso && !opcoesNivelAcesso.includes(nivelAcesso)) {
        throw new AppError (
          "Nivel de acesso deve estar dentro dessas opções: | ADMIN | VENDAS | BALCAO | DELIVERY | EXTERNO | USUARIO |",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "NIVEL_ACESSO_NOT_FOUND"
        )
      }

      const servico = new AlterarUsuarioServico()
      const resultado = await servico.executar(id, statusValidado, nivelAcesso)

      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { AlterarUsuarioControlador }

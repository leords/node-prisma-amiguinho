import { ERRO_MSG_USUARIO, HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'

class AlterarUsuarioServico {
  async executar(id, status, nivelAcesso) {
    try {

      const usuario = await prismaCliente.usuario.findUnique({
        where: {id},
      })

      if (!usuario) {
        throw new AppError(
          ERRO_MSG_USUARIO.USUARIO_INVALIDO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "USUARIO_NOT_FOUND"
        )
      }

      const statusFormatado = String(status).toUpperCase() === 'ATIVO'
      const nivelAcessoFormatado = String(nivelAcesso).toUpperCase()


      const alterarUsuario = await prismaCliente.usuario.update({
        where: {
          id: id,
        },
        data: {
          status: statusFormatado,
          nivelAcesso: nivelAcessoFormatado
        },
      })

      return alterarUsuario
      
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { AlterarUsuarioServico }

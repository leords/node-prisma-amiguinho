import { ERRO_MSG_USUARIO, HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'

class AlterarUsuarioServico {
  async executar(id, statusValidado, nivelAcesso) {
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


      const nivelAcessoUpperCase = nivelAcesso ? String(nivelAcesso).toUpperCase() : undefined


      const alterarUsuario = await prismaCliente.usuario.update({
        where: {
          id: id,
        },
        data: {
          status: statusValidado ? statusValidado : undefined,
          nivelAcesso: nivelAcessoUpperCase
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

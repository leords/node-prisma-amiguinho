import { ERRO_MSG_USUARIO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class AlterarUsuarioServico {
  async executar(id) {
    try {
      const usuario = await prismaCliente.usuario.findUnique({
        where: {
          id: id,
        },
      })

      if (!usuario) {
        throw new Error(ERRO_MSG_USUARIO.USUARIO_INVALIDO)
      }

      const alterarUsuario = await prismaCliente.usuario.update({
        where: {
          id: id,
        },
        data: {
          status: !usuario.status,
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

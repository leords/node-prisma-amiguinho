import bcrypt from 'bcryptjs'
import { ERRO_MSG_USUARIO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class NovoUsuarioServico {
  async executar(nome, email, usuario, senha, nivelAcessoId) {
    try {
      // Valida a existencia de usuário, sendo que usúario é unico!
      const buscarUsuario = await prismaCliente.usuario.findUnique({
        where: {
          usuario: usuario,
        },
      })
      if (buscarUsuario) {
        throw new Error(ERRO_MSG_USUARIO.USUARIO_JA_EXISTE)
      }

      const senhaCriptografada = await bcrypt.hash(senha, 8)

      const novoUsuario = await prismaCliente.usuario.create({
        data: {
          nome,
          email,
          usuario,
          senha: senhaCriptografada,
          nivelAcessoId,
        },
      })

      return novoUsuario
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { NovoUsuarioServico }

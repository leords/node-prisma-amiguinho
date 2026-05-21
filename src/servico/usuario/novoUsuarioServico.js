import bcrypt from 'bcryptjs'
import { ERRO_MSG_USUARIO, HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'

class NovoUsuarioServico {
  async executar(nome, email, usuario, senha, whatsapp, nivelAcesso) {

    console.log('Dados: ', nome, email, usuario, senha, whatsapp, nivelAcesso)
    
    try {
      // Valida a existencia de usuário, sendo que usúario é unico!
      const buscarUsuario = await prismaCliente.usuario.findUnique({
        where: {
          usuario: usuario,
        },
      })

      if (buscarUsuario) {
        throw new Error(ERRO_MSG_USUARIO.USUARIO_JA_EXISTE)

        throw new AppError(
          ERRO_MSG_USUARIO.USUARIO_JA_EXISTE,
          HTTP_STATUS_CODES.CONFLICT,
          "USUARIO_NOT_AVAILABLE"
        )
      }

      const validarEmail = await prismaCliente.usuario.findUnique({
        where: {
          email: email
        }
      })

      if(validarEmail) {
        throw new AppError(
          "Este email já está cadastrado",
          HTTP_STATUS_CODES.CONFLICT,
          "EMAIL_NOT_AVAILABLE"
        )
      }

      const senhaCriptografada = await bcrypt.hash(senha, 8)

      const novoUsuario = await prismaCliente.usuario.create({
        data: {
          nome,
          email,
          usuario,
          senha: senhaCriptografada,
          whatsapp,
          nivelAcesso
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

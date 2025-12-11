import { ERRO_MSG_USUARIO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'
import bcrypt from 'bcryptjs'

class ResetarSenhaServico {
  async executar(token, novaSenha) {
    try {
      // Busca o usuário com token válido e ainda não expirado
      const usuario = await prismaCliente.usuario.findFirst({
        where: {
          resetToken: token,
          resetExpires: { gte: new Date() }, // token ainda válido
        },
      })

      if (!usuario) {
        throw new Error(ERRO_MSG_USUARIO.TOKEN_INVALIDO)
      }

      if (usuario.resetExpires < new Date()) {
        throw new Error(ERRO_MSG_USUARIO.TOKEN_EXPIRADO)
      }

      // Gera hash da nova senha
      const hash = await bcrypt.hash(novaSenha, 10)

      // Atualiza a senha e limpa o token do banco
      await prismaCliente.usuario.update({
        where: { id: usuario.id },
        data: {
          senha: hash,
          resetToken: null,
          resetExpires: null,
        },
      })

      return true
    } catch (error) {
      console.error('Erro no resetarSenhaComToken =>', error)
      throw error
    }
  }
}
export { ResetarSenhaServico }

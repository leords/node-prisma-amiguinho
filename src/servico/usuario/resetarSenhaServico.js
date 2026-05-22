import { ERRO_MSG_USUARIO, HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'
import bcrypt from 'bcryptjs'
import { EnviarEmailServico } from '../email/enviarEmailServico.js'

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
        throw new AppError(
          ERRO_MSG_USUARIO.TOKEN_INVALIDO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "USUARIO_NOT_FOUND"
        )
      }


      // Gera hash da nova senha
      const hash = await bcrypt.hash(novaSenha, 10)

      // Atualiza a senha e limpa o token do banco
      const usuarioAtualizado = await prismaCliente.usuario.update({
        where: { id: usuario.id },
        data: {
          senha: hash,
          resetToken: null,
          resetExpires: null,
        },
      })

      // Enviando email de nova senha para o email do usuário.
      if(usuarioAtualizado) {
          const html = `
            <h2>Senha alterada com sucesso</h2>
            <p>Sua senha foi redefinida com sucesso.</p>
          `

        const servico = new EnviarEmailServico();
        await servico.enviarNovoEmail(usuario.email, 'Sistema Amiguinho - senha alterada', html )
      }

      
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
export { ResetarSenhaServico }

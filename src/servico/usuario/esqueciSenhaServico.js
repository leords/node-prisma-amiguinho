import crypto from 'crypto'
import prismaCliente from '../../prisma/index.js'
import emailServico from '../email/emailServico.js'

class EsqueciSenhaServico {
  async executar(email) {
    try {
      const usuario = await prismaCliente.usuario.findUnique({
        where: { email },
      })
      if (!usuario) {
        return
      }

      // Gera um token de 32 bytes hexadecimais
      const token = crypto.randomBytes(32).toString('hex')

      // Define expiração (15 minutos)
      const expires = new Date(Date.now() + 1000 * 60 * 15)

      // Atualiza o usuário com o token + expiração
      await prismaCliente.usuario.update({
        where: { id: usuario.id },
        data: {
          resetToken: token,
          resetExpires: expires,
        },
      })

      // Envia o e-mail (classe separada na pasta utils)
      await emailServico.enviar({
        to: usuario.email,
        subject: 'Redefinição de senha',
        html: `
          <h2>Redefinição de senha</h2>
          <p>Você solicitou a redefinição da sua senha.</p>
          <p>Estamos te enviando o token para validar a troca da senha</p>
          <p>TOKEN: ${token}</p>
          <br />
          <p>Este token expira em 15 minutos.</p>
        `,
      })
    } catch (error) {
      console.error('Erro no gerarTokenEEnviarEmail =>', error)
      throw error
    }
  }
}

export { EsqueciSenhaServico }

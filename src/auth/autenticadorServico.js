// auth/autenticadorServico.js
import { ERRO_MSG_USUARIO } from '../config/httpStatusCodes.js'
import { AppError } from '../error/appError.js'
import prismaCliente from '../prisma/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AutenticadorServico {
  async login(usuario, senha) {
    if (!usuario || !senha) {
      throw new AppError(ERRO_MSG_USUARIO.CAMPO_AUSENTE, 401, "USUARIO_INVALIDO")
    }

    const acessante = await prismaCliente.usuario.findUnique({
      where: { usuario },
    })

    if (!acessante || !acessante.status) {
      throw new AppError(ERRO_MSG_USUARIO.USUARIO_INVALIDO, 401, "USUARIO_INVALIDO")
    }

    const senhaValida = await bcrypt.compare(senha, acessante.senha)
    if (!senhaValida) {
      throw new AppError(ERRO_MSG_USUARIO.DADOS_LOGIN_INCORRETOS, 401, "DADOS_LOGIN_INCORRETOS")
    }

    const token = this.#gerarAccessToken(acessante)
    const refreshToken = await this.#gerarRefreshToken(acessante.id)

    return {
      token,
      refreshToken,
      usuario: {
        id: acessante.id,
        nome: acessante.nome,
        usuario: acessante.usuario,
        nivelAcesso: acessante.nivelAcesso,
      },
    }
  }

  async refresh(refreshTokenRecebido) {
    // valida o reflashToken
    if (!refreshTokenRecebido) {
      throw new AppError("Refresh token não enviado", 400, "REFRESH_TOKEN_AUSENTE")
    }

    let payload
    // Verifico o token
    try {
      payload = jwt.verify(refreshTokenRecebido, process.env.JWT_REFRESH_SECRETA)
    } catch {
      throw new AppError("Refresh token inválido ou expirado", 401, "REFRESH_TOKEN_INVALIDO")
    }

    // Busco o reflesh token no banco
    const tokenNoBanco = await prismaCliente.refreshToken.findUnique({
      where: { token: refreshTokenRecebido },
    })

    if (!tokenNoBanco || tokenNoBanco.expiraEm < new Date()) {
      throw new AppError("Refresh token inválido ou expirado", 401, "REFRESH_TOKEN_INVALIDO")
    }

    const acessante = await prismaCliente.usuario.findUnique({
      where: { id: payload.id },
    })

    if (!acessante || !acessante.status) {
      throw new AppError(ERRO_MSG_USUARIO.USUARIO_INVALIDO, 401, "USUARIO_INVALIDO")
    }

    const novoAccessToken = this.#gerarAccessToken(acessante)

    return { token: novoAccessToken }
  }

  async logout(refreshTokenRecebido) {
    if (refreshTokenRecebido) {
      await prismaCliente.refreshToken.deleteMany({
        where: { token: refreshTokenRecebido },
      })
    }
    return { mensagem: "Deslogado com sucesso" }
  }

  
// Metodos privados usando hash syntax
// Sendo possivel ser chamados apenas dentro da propria classe.
  #gerarAccessToken(acessante) {
    return jwt.sign(
      {
        id: acessante.id,
        usuario: acessante.nome,
        nivelAcesso: acessante.nivelAcesso,
      },
      process.env.JWT_SECRETA,
      { expiresIn: '10h' } // reduzido, já que agora tem refresh
    )
  }

  // Token para apenas fazer o reflesh do usuario já logado.
  async #gerarRefreshToken(usuarioId) {
    const refreshToken = jwt.sign(
      { id: usuarioId },
      process.env.JWT_SECRETA,
      { expiresIn: '7d' }
    )

    await prismaCliente.refreshToken.create({
      data: {
        token: refreshToken,
        usuarioId,
        expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return refreshToken
  }
}

export { AutenticadorServico }

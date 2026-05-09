import { ERRO_MSG_USUARIO } from '../config/httpStatusCodes.js'
import { AppError } from '../error/appError.js'
import prismaCliente from '../prisma/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AutenticadorServico {
  async login(usuario, senha) {
    // validando se os campos estão preenchidos
    if (!usuario || !senha) {
      throw new AppError(
        ERRO_MSG_USUARIO.CAMPO_AUSENTE,
        401,
        "USUARIO_INVALIDO"
      )
    }
    
    // Buscando o usuário no banco
    const acessante = await prismaCliente.usuario.findUnique({
      where: {
        usuario: usuario,
      },
    })
    // validando a existencia do usuário e se o mesmo é ativo
    if (!acessante || !acessante.status) {
      throw new AppError(
        ERRO_MSG_USUARIO.USUARIO_INVALIDO,
        401,
        "USUARIO_INVALIDO"
      )
    }

    // Validando se a senha é correta
    const senhaValida = await bcrypt.compare(senha, acessante.senha)
    if (!senhaValida) {
      throw new AppError(
        ERRO_MSG_USUARIO.DADOS_LOGIN_INCORRETOS,
        401,
        "DADOS_LOGIN_INCORRETOS"
      )
    }
    // Criando o token e assinando
    const token = jwt.sign(
      {
        id: acessante.id,
        usuario: acessante.nome,
        nivelAcesso: acessante.nivelAcesso
      },
      process.env.JWT_SECRETA,
      { expiresIn: '8h' }
    )
    // retornando ao front o token e o objeto
    return {
      token,
      usuario: {
        id: acessante.id,
        nome: acessante.nome,
        usuario: acessante.usuario,
        nivelAcesso: acessante.nivelAcesso,
      },
    }
  }
}

export { AutenticadorServico }

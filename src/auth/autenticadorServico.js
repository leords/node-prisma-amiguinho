import { ERRO_MSG_USUARIO } from '../config/httpStatusCodes.js'
import prismaCliente from '../prisma/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AutenticadorServico {
  async login(usuario, senha) {
    // validando se os campos estão preenchidos
    if (!usuario || !senha) {
      throw new Error(ERRO_MSG_USUARIO.CAMPO_AUSENTE)
    }
    // buscando o usuário no banco
    const acessante = await prismaCliente.usuario.findUnique({
      where: {
        usuario: usuario,
      },
    })
    // validando a existencia do usuário e se o mesmo é ativo
    if (!acessante || !acessante.status) {
      throw new Error(ERRO_MSG_USUARIO.USUARIO_INVALIDO)
    }
    // validando se a senha é correta
    const senhaValida = await bcrypt.compare(senha, acessante.senha)
    if (!senhaValida) {
      throw new Error(ERRO_MSG_USUARIO.DADOS_LOGIN_INCORRETOS)
    }
    // criando o token e assinando
    const token = jwt.sign(
      {
        id: acessante.id,
        usuario: acessante.nome,
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
        nivelAcesso: acessante.nivelAcessoId,
      },
    }
  }
}

export { AutenticadorServico }

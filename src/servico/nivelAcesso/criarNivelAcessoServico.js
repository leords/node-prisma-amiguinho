import { ERRO_MSG_NIVEL_ACESSO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class CriarNivelAcessoServico {
  async executar(nome) {
    try {
      const buscarNivelAcesso = await prismaCliente.nivelAcesso.findFirst({
        where: {
          nome: nome,
        },
      })

      if (buscarNivelAcesso) {
        throw new Error(ERRO_MSG_NIVEL_ACESSO.NIVEL_JA_EXISTE)
      }

      const nivelAcesso = await prismaCliente.nivelAcesso.create({
        data: {
          nome,
        },
      })
      return nivelAcesso
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { CriarNivelAcessoServico }

import prismaCliente from '../../prisma/index.js'

class ListarNivelAcessoServico {
  async executar() {
    try {
      const nivelAcesso = await prismaCliente.nivelAcesso.findMany()
      return nivelAcesso
    } catch (error) {
      throw error
    }
  }
}

export { ListarNivelAcessoServico }

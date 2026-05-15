import prismaCliente from '../../prisma/index.js'

class listarUsuarioServico {
  async executar() {
    try {
      const usuarios = await prismaCliente.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          usuario: true,
          status: true,
          nivelAcesso: true,
          whatsapp: true
        },
      })
      return usuarios
    } catch (error) {
      throw error
    }
  }
}

export { listarUsuarioServico }

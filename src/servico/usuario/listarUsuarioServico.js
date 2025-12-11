import prismaCliente from '../../prisma/index.js'

class ListarUsuarioServico {
  async executar() {
    try {
      const usuarios = await prismaCliente.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          usuario: true,
          status: true,
          nivelAcesso: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      })
      return usuarios
    } catch (error) {
      throw error
    }
  }
}

export { ListarUsuarioServico }

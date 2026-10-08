import prismaCliente from '../../prisma/index.js'

class ListarMotoristaServico {
  async executar({ status } = {}) {
    const where = {}

    if (status !== undefined) {
      where.status = status === 'true' || status === true
    }

    const motoristas = await prismaCliente.motorista.findMany({
      where,
      orderBy: { nome: 'asc' },
    })

    return motoristas
  }
}

export { ListarMotoristaServico }

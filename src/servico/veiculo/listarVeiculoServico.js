import prismaCliente from '../../prisma/index.js'

class ListarVeiculoServico {
  async executar({ status, emRota } = {}) {
    const where = {}

    if (status !== undefined) {
      where.status = status === 'true' || status === true
    }

    if (emRota !== undefined) {
      where.emRota = emRota === 'true' || emRota === true
    }

    const veiculos = await prismaCliente.veiculo.findMany({
      where,
      orderBy: { nome: 'asc' },
    })

    return veiculos
  }
}

export { ListarVeiculoServico }

import prismaCliente from '../../prisma/index.js'

class LerFormaPagamentoServico {
  async balcao(status) {
    try {
      const formas = await prismaCliente.formaPagamento.findMany({
        where: {
          status: status,
          tipo: {
            in: ['BALCÃO', 'VENDAS'],
          },
        },
      })

      return formas
    } catch (error) {
      throw error
    }
  }

  async externa(status) {
    try {
      const formas = await prismaCliente.formaPagamento.findMany({
        where: {
          status: status,
          tipo: 'VENDAS'
        },
      })

      return formas
    } catch (error) {
      throw error
    }
  }
}

export { LerFormaPagamentoServico }

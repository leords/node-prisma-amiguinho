import prismaCliente from '../../prisma/index.js'

class LerFormaPagamentoServico {
  async geral(status) {
    try {
      const formas = await prismaCliente.formaPagamento.findMany({
        where: {
          status: status,
          nome: {
            in: ['A VISTA', 'PIX', 'CARTÃO', 'CHEQUE'],
          },
        },
      })

      return formas
    } catch (error) {
      throw error
    }
  }
  async balcao(status) {
    try {
      const formas = await prismaCliente.formaPagamento.findMany({
        where: {
          status: status,
        },
      })

      return formas
    } catch (error) {
      throw error
    }
  }
}

export { LerFormaPagamentoServico }

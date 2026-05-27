import prismaCliente from '../../prisma/index.js'

class bsucarValeInternoServico {
  async executar(
    vendedor,
    cliente,
    formaPagamento,
    dataInicio,
    dataFim,
    usuarioId,
    status
  ) {

    try {
        return await prismaCliente.pedidoBalcao.findMany({
          where: {
            vendedor,
            cliente,
            formaPagamento: {
              nome: {
                notIn: ["A VISTA", "PIX", "CARTÃO", "CHEQUE", "ORÇAMENTO"]
              }
            },
            data: {
              gte: dataInicio,
              lte: dataFim
            },
            usuarioId,
            status
          },
          include: {
            itens: true,
            formaPagamento: true,
          },
        })
    
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { bsucarValeInternoServico }

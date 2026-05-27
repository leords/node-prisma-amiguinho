import prismaCliente from '../../prisma/index.js'

class buscarValeInternoServico {
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
              nome: formaPagamento
              ? formaPagamento 
              : {
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

export { buscarValeInternoServico }

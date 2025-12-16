import prismaCliente from '../../prisma/index.js'

class BuscarFechamentoBalcaoDiaServico {
  async executar(inicio, fim, vendedor) {
    try {
      // buscando o total de vendas
      const total = await prismaCliente.pedidoBalcao.aggregate({
        where: {
          data: {
            gte: inicio,
            lte: fim,
          },
          vendedor,
        },
        _sum: {
          total: true,
        },
      })

      // buscando formas de pagamentos por grupo, via ID
      const totais = await prismaCliente.pedidoBalcao.groupBy({
        by: ['formaPagamentoId'],
        where: {
          data: {
            gte: inicio,
            lte: fim,
          },
          vendedor,
        },
        _sum: {
          total: true,
        },
      })

      // validando o retorno de totais
      if (!Array.isArray(totais)) {
        throw new Error('Erro ao agrupar totais por forma de pagamento')
      }

      // criando uma lista com as formas de pagamentos que aparecem nos pedidos agrupados acima.
      const formasPagamento = await prismaCliente.formaPagamento.findMany({
        where: {
          id: {
            //Cria um array de IDs vindos do groupBy
            in: totais.map((t) => t.formaPagamentoId),
          },
        },
      })

      const resultado = totais.map((t) => {
        // Encontra a forma de pagamento correspondente ao ID
        const forma = formasPagamento.find((f) => f.id === t.formaPagamentoId)

        return {
          formaPagamentoId: t.formaPagamentoId,
          formaPagamento: forma?.nome ?? 'Não informado',
          total: t._sum.total || 0,
        }
      })

      // criando o retorno

      const resultadoFinal = {
        resultado: resultado,
        total: total._sum.total || 0,
      }

      return resultadoFinal
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { BuscarFechamentoBalcaoDiaServico }

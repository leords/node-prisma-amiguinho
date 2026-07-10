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
        _count: {
          id: true,
        },
      })

      const totalInterno = await prismaCliente.pagamentoPedidoBalcao.aggregate({
        where: {
          pedido: {
            vendedor: vendedor || undefined,
            data: {
              gte: inicio,
              lte: fim,
            },
          },
          formaPagamento: {
            nome: {
              notIn: ["A VISTA", "CARTÃO", "PIX", "CHEQUE", "DINHEIRO"],
            },
          },
        },
        _sum: {
          valor: true,
        },
      });

      // buscando formas de pagamentos por grupo, via ID
      const totais = await prismaCliente.pagamentoPedidoBalcao.groupBy({
        by: ['formaPagamentoId'],
        where: {
          pedido: {
            vendedor: vendedor || undefined,
            data: {
              gte: inicio,
              lte: fim,
            },
          },
        },
        _sum: {
          valor: true,
        },
      });

      // validando o retorno de totais
      if (!Array.isArray(totais)) {
        throw new Error('Erro ao agrupar totais por forma de pagamento')
      }

      // criando uma lista com as formas de pagamentos que aparecem nos pedidos agrupados acima.
      const formasPagamento = await prismaCliente.formaPagamento.findMany({
        select: {
          id: true,
          nome: true,
        },
      })

      const resultado = totais.reduce((acc, t) => {
        const forma = formasPagamento.find((f) => f.id === t.formaPagamentoId);

        const chave =
          forma?.nome?.toLowerCase()?.replace(/\s+/g, "_") ?? "nao_informado";

        acc[chave] = t._sum.valor ?? 0;

        return acc;
      }, {});

      // criando o retorno
      const resultadoFinal = {
        resultado: resultado,
        total: total._sum.total || 0,
        interno: totalInterno._sum.valor || 0,
        quantidade: total._count.id || 0,
      }

      return resultadoFinal
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { BuscarFechamentoBalcaoDiaServico }

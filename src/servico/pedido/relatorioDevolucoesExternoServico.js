import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class RelatorioDevolucoesExternoServico {
  async executar({ dataInicio, dataFim, vendedor }) {
    if (!dataInicio || !dataFim) {
      throw new AppError(
        ERRO_MSG_PEDIDOS.DATA_OBRIGATORIA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'DATA_OBRIGATORIA'
      )
    }

    const dataInicioStr = String(dataInicio).trim().split('T')[0]
    const dataFimStr = String(dataFim).trim().split('T')[0]

    const inicio = new Date(`${dataInicioStr}T00:00:00.000`)
    const fim = new Date(`${dataFimStr}T23:59:59.999`)

    const whereBase = {
      data: {
        gte: inicio,
        lte: fim,
      },
    }

    if (vendedor && String(vendedor).trim().toLowerCase() !== 'todos') {
      whereBase.vendedor = {
        equals: String(vendedor).trim(),
        mode: 'insensitive',
      }
    }

    // 1. Totais e quantidade geral do período
    const totaisGerais = await prismaCliente.pedidoExterno.aggregate({
      _sum: { total: true },
      where: whereBase,
    })

    const quantidadeTotalPedidos = await prismaCliente.pedidoExterno.count({
      where: whereBase,
    })

    // 2. Totais e pedidos devolvidos do período
    const whereDevolvidos = {
      ...whereBase,
      status: 'devolvido',
    }

    const totaisDevolvidos = await prismaCliente.pedidoExterno.aggregate({
      _sum: { total: true },
      where: whereDevolvidos,
    })

    const quantidadePedidosDevolvidos = await prismaCliente.pedidoExterno.count({
      where: whereDevolvidos,
    })

    const listaPedidosDevolvidos = await prismaCliente.pedidoExterno.findMany({
      where: whereDevolvidos,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            cidade: true,
            endereco: true,
            telefone: true,
          },
        },
        formaPagamento: {
          select: {
            id: true,
            nome: true,
            tipo: true,
          },
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                embalagem: true,
                precoVenda: true,
              },
            },
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            usuario: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    })

    const valorTotalPedidos = Number((totaisGerais._sum?.total || 0).toFixed(2))
    const valorTotalDevolvido = Number((totaisDevolvidos._sum?.total || 0).toFixed(2))

    const percentualQuantidade =
      quantidadeTotalPedidos > 0
        ? Number(((quantidadePedidosDevolvidos / quantidadeTotalPedidos) * 100).toFixed(2))
        : 0

    const percentualValor =
      valorTotalPedidos > 0
        ? Number(((valorTotalDevolvido / valorTotalPedidos) * 100).toFixed(2))
        : 0

    return {
      filtros: {
        dataInicio: dataInicioStr,
        dataFim: dataFimStr,
        vendedor: vendedor || 'todos',
      },
      resumo: {
        quantidadePedidosDevolvidos,
        valorTotalDevolvido,
        quantidadeTotalPedidos,
        valorTotalPedidos,
        percentualQuantidade,
        percentualValor,
      },
      pedidosDevolvidos: listaPedidosDevolvidos,
    }
  }
}

export { RelatorioDevolucoesExternoServico }

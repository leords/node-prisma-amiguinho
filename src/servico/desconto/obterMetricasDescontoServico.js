import prismaCliente from '../../prisma/index.js'

class ObterMetricasDescontoServico {
  async executar({
    setor,
    dataInicio,
    dataFim,
    vendedor,
    cliente,
    usuarioId,
    status,
  } = {}) {
    const produtosDesconto = await prismaCliente.produto.findMany({
      where: {
        nome: {
          contains: 'DESCONTO',
          mode: 'insensitive',
        },
      },
      select: { id: true, nome: true },
    })

    const idsDesconto = produtosDesconto.map((p) => p.id)

    let dataFiltro = undefined
    if (dataInicio || dataFim) {
      dataFiltro = {}
      if (dataInicio) {
        const dataStr = String(dataInicio).trim().split('T')[0]
        const inicio = new Date(`${dataStr}T00:00:00.000`)
        dataFiltro.gte = isNaN(inicio.getTime()) ? new Date(dataInicio) : inicio
      }
      if (dataFim) {
        const dataStr = String(dataFim).trim().split('T')[0]
        const fim = new Date(`${dataStr}T23:59:59.999`)
        dataFiltro.lte = isNaN(fim.getTime()) ? new Date(dataFim) : fim
      }
    }

    const filtroBase = {
      ...(status ? { status } : { status: { not: 'cancelado' } }),
      ...(dataFiltro ? { data: dataFiltro } : {}),
      ...(vendedor
        ? { vendedor: { contains: String(vendedor).trim(), mode: 'insensitive' } }
        : {}),
      ...(usuarioId ? { usuarioId: Number(usuarioId) } : {}),
    }

    const itemFiltro = {
      OR: [
        ...(idsDesconto.length ? [{ produtoId: { in: idsDesconto } }] : []),
        { produto: { nome: { contains: 'DESCONTO', mode: 'insensitive' } } },
        { valorTotal: { lt: 0 } },
      ],
      valorTotal: { not: 0 },
    }

    const promises = []

    const consultarBalcao =
      !setor || setor === 'geral' || setor === 'todos' || setor === 'balcao'
    const consultarDelivery =
      !setor || setor === 'geral' || setor === 'todos' || setor === 'delivery'
    const consultarExterno =
      !setor || setor === 'geral' || setor === 'todos' || setor === 'externo'

    if (consultarBalcao) {
      const whereBalcao = {
        ...filtroBase,
        ...(cliente
          ? { cliente: { contains: String(cliente).trim(), mode: 'insensitive' } }
          : {}),
        itens: {
          some: itemFiltro,
        },
      }

      promises.push(
        prismaCliente.pedidoBalcao
          .findMany({
            where: whereBalcao,
            select: {
              id: true,
              itens: {
                where: itemFiltro,
                select: {
                  produtoId: true,
                  quantidade: true,
                  valorUnit: true,
                  valorTotal: true,
                  produto: {
                    select: { id: true, nome: true },
                  },
                },
              },
            },
          })
          .then((pedidos) => ({ setor: 'balcao', pedidos }))
      )
    }

    if (consultarDelivery) {
      const whereDelivery = {
        ...filtroBase,
        ...(cliente
          ? {
              cliente: {
                nome: { contains: String(cliente).trim(), mode: 'insensitive' },
              },
            }
          : {}),
        itens: {
          some: itemFiltro,
        },
      }

      promises.push(
        prismaCliente.pedidoDelivery
          .findMany({
            where: whereDelivery,
            select: {
              id: true,
              itens: {
                where: itemFiltro,
                select: {
                  produtoId: true,
                  quantidade: true,
                  valorUnit: true,
                  valorTotal: true,
                  produto: {
                    select: { id: true, nome: true },
                  },
                },
              },
            },
          })
          .then((pedidos) => ({ setor: 'delivery', pedidos }))
      )
    }

    if (consultarExterno) {
      const whereExterno = {
        ...filtroBase,
        ...(cliente
          ? {
              cliente: {
                nome: { contains: String(cliente).trim(), mode: 'insensitive' },
              },
            }
          : {}),
        itens: {
          some: itemFiltro,
        },
      }

      promises.push(
        prismaCliente.pedidoExterno
          .findMany({
            where: whereExterno,
            select: {
              id: true,
              itens: {
                where: itemFiltro,
                select: {
                  produtoId: true,
                  quantidade: true,
                  valorUnit: true,
                  valorTotal: true,
                  produto: {
                    select: { id: true, nome: true },
                  },
                },
              },
            },
          })
          .then((pedidos) => ({ setor: 'externo', pedidos }))
      )
    }

    const resultados = await Promise.all(promises)

    const detalhes = {
      balcao: {
        quantidadeVezesAdicionado: 0,
        quantidadeTotalItens: 0,
        totalValorDesconto: 0,
        quantidadePedidos: 0,
      },
      delivery: {
        quantidadeVezesAdicionado: 0,
        quantidadeTotalItens: 0,
        totalValorDesconto: 0,
        quantidadePedidos: 0,
      },
      externo: {
        quantidadeVezesAdicionado: 0,
        quantidadeTotalItens: 0,
        totalValorDesconto: 0,
        quantidadePedidos: 0,
      },
    }

    let quantidadeVezesAdicionadoGeral = 0
    let quantidadeTotalItensGeral = 0
    let totalValorDescontoGeral = 0
    let quantidadePedidosGeral = 0

    for (const res of resultados) {
      let vezes = 0
      let totalItens = 0
      let totalValor = 0
      let pedidosComDescontoValido = 0

      for (const ped of res.pedidos) {
        const itensDesconto = (ped.itens || []).filter((it) => {
          const nome = String(it.produto?.nome || '').toUpperCase()
          const val = Number(it.valorTotal || 0)
          return (
            (idsDesconto.includes(it.produtoId) ||
              nome.includes('DESCONTO') ||
              val < 0) &&
            val !== 0
          )
        })

        if (itensDesconto.length > 0) {
          pedidosComDescontoValido += 1
          vezes += itensDesconto.length
          for (const item of itensDesconto) {
            const valor = Math.abs(Number(item.valorTotal || 0))
            const qtd = Math.abs(Number(item.quantidade || 1))
            totalItens += qtd
            totalValor += valor
          }
        }
      }

      detalhes[res.setor] = {
        quantidadeVezesAdicionado: vezes,
        quantidadeTotalItens: Number(totalItens.toFixed(2)),
        totalValorDesconto: Number(totalValor.toFixed(2)),
        quantidadePedidos: pedidosComDescontoValido,
      }

      quantidadeVezesAdicionadoGeral += vezes
      quantidadeTotalItensGeral += totalItens
      totalValorDescontoGeral += totalValor
      quantidadePedidosGeral += pedidosComDescontoValido
    }

    return {
      setor: setor || 'geral',
      quantidadeVezesAdicionado: quantidadeVezesAdicionadoGeral,
      quantidadeTotalItens: Number(quantidadeTotalItensGeral.toFixed(2)),
      totalValorDesconto: Number(totalValorDescontoGeral.toFixed(2)),
      quantidadePedidos: quantidadePedidosGeral,
      detalhes,
    }
  }
}

export { ObterMetricasDescontoServico }

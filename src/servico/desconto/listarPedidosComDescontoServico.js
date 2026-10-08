import prismaCliente from '../../prisma/index.js'

class ListarPedidosComDescontoServico {
  async executar({
    setor,
    dataInicio,
    dataFim,
    vendedor,
    cliente,
    clienteId,
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
            include: {
              usuario: {
                select: { id: true, nome: true, usuario: true },
              },
              pagamentos: {
                include: {
                  formaPagamento: true,
                },
              },
              itens: {
                include: {
                  produto: true,
                },
              },
            },
            orderBy: { data: 'desc' },
          })
          .then((pedidos) =>
            pedidos
              .map((ped) => {
                const itensDesconto = (ped.itens || [])
                  .filter((it) => {
                    const nome = String(it.produto?.nome || '').toUpperCase()
                    const val = Number(it.valorTotal || 0)
                    return (
                      (idsDesconto.includes(it.produtoId) ||
                        nome.includes('DESCONTO') ||
                        val < 0) &&
                      val !== 0
                    )
                  })
                  .map((d) => ({
                    id: d.id,
                    produtoId: d.produtoId,
                    produtoNome: d.produto?.nome || 'DESCONTO',
                    quantidade: Math.abs(Number(d.quantidade || 1)),
                    valorUnit: Math.abs(Number(d.valorUnit || 0)),
                    valorTotal: Math.abs(Number(d.valorTotal || 0)),
                  }))

                const totalDesconto = itensDesconto.reduce(
                  (sum, item) => sum + item.valorTotal,
                  0
                )
                const quantidadeDescontos = itensDesconto.reduce(
                  (sum, item) => sum + item.quantidade,
                  0
                )

                return {
                  id: ped.id,
                  uuid: ped.uuid,
                  setor: 'balcao',
                  data: ped.data,
                  status: ped.status,
                  total: ped.total,
                  vendedor:
                    ped.vendedor || ped.nomeUsuario || ped.usuario?.nome || null,
                  cliente: {
                    id: null,
                    nome: ped.cliente || 'Cliente Balcão',
                  },
                  usuario: ped.usuario,
                  pagamentos: ped.pagamentos,
                  descontos: itensDesconto,
                  totalDesconto: Number(totalDesconto.toFixed(2)),
                  quantidadeDescontos: Number(quantidadeDescontos.toFixed(2)),
                  itens: ped.itens,
                }
              })
              .filter((ped) => ped.descontos.length > 0)
          )
      )
    }

    if (consultarDelivery) {
      const whereDelivery = {
        ...filtroBase,
        ...(clienteId ? { clienteId: Number(clienteId) } : {}),
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
            include: {
              cliente: true,
              formaPagamento: true,
              usuario: {
                select: { id: true, nome: true, usuario: true },
              },
              itens: {
                include: {
                  produto: true,
                },
              },
            },
            orderBy: { data: 'desc' },
          })
          .then((pedidos) =>
            pedidos
              .map((ped) => {
                const itensDesconto = (ped.itens || [])
                  .filter((it) => {
                    const nome = String(it.produto?.nome || '').toUpperCase()
                    const val = Number(it.valorTotal || 0)
                    return (
                      (idsDesconto.includes(it.produtoId) ||
                        nome.includes('DESCONTO') ||
                        val < 0) &&
                      val !== 0
                    )
                  })
                  .map((d) => ({
                    id: d.id,
                    produtoId: d.produtoId,
                    produtoNome: d.produto?.nome || 'DESCONTO',
                    quantidade: Math.abs(Number(d.quantidade || 1)),
                    valorUnit: Math.abs(Number(d.valorUnit || 0)),
                    valorTotal: Math.abs(Number(d.valorTotal || 0)),
                  }))

                const totalDesconto = itensDesconto.reduce(
                  (sum, item) => sum + item.valorTotal,
                  0
                )
                const quantidadeDescontos = itensDesconto.reduce(
                  (sum, item) => sum + item.quantidade,
                  0
                )

                return {
                  id: ped.id,
                  uuid: ped.uuid,
                  setor: 'delivery',
                  data: ped.data,
                  status: ped.status,
                  total: ped.total,
                  vendedor: ped.vendedor || ped.usuario?.nome || null,
                  cliente: ped.cliente,
                  formaPagamento: ped.formaPagamento,
                  usuario: ped.usuario,
                  descontos: itensDesconto,
                  totalDesconto: Number(totalDesconto.toFixed(2)),
                  quantidadeDescontos: Number(quantidadeDescontos.toFixed(2)),
                  itens: ped.itens,
                }
              })
              .filter((ped) => ped.descontos.length > 0)
          )
      )
    }

    if (consultarExterno) {
      const whereExterno = {
        ...filtroBase,
        ...(clienteId ? { clienteId: Number(clienteId) } : {}),
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
            include: {
              cliente: true,
              formaPagamento: true,
              carga: true,
              usuario: {
                select: { id: true, nome: true, usuario: true },
              },
              itens: {
                include: {
                  produto: true,
                },
              },
            },
            orderBy: { data: 'desc' },
          })
          .then((pedidos) =>
            pedidos
              .map((ped) => {
                const itensDesconto = (ped.itens || [])
                  .filter((it) => {
                    const nome = String(it.produto?.nome || '').toUpperCase()
                    const val = Number(it.valorTotal || 0)
                    return (
                      (idsDesconto.includes(it.produtoId) ||
                        nome.includes('DESCONTO') ||
                        val < 0) &&
                      val !== 0
                    )
                  })
                  .map((d) => ({
                    id: d.id,
                    produtoId: d.produtoId,
                    produtoNome: d.produto?.nome || 'DESCONTO',
                    quantidade: Math.abs(Number(d.quantidade || 1)),
                    valorUnit: Math.abs(Number(d.valorUnit || 0)),
                    valorTotal: Math.abs(Number(d.valorTotal || 0)),
                  }))

                const totalDesconto = itensDesconto.reduce(
                  (sum, item) => sum + item.valorTotal,
                  0
                )
                const quantidadeDescontos = itensDesconto.reduce(
                  (sum, item) => sum + item.quantidade,
                  0
                )

                return {
                  id: ped.id,
                  uuid: ped.uuid,
                  setor: 'externo',
                  data: ped.data,
                  status: ped.status,
                  total: ped.total,
                  vendedor: ped.vendedor || ped.usuario?.nome || null,
                  cliente: ped.cliente,
                  formaPagamento: ped.formaPagamento,
                  carga: ped.carga,
                  usuario: ped.usuario,
                  descontos: itensDesconto,
                  totalDesconto: Number(totalDesconto.toFixed(2)),
                  quantidadeDescontos: Number(quantidadeDescontos.toFixed(2)),
                  itens: ped.itens,
                }
              })
              .filter((ped) => ped.descontos.length > 0)
          )
      )
    }

    const resultadosArrays = await Promise.all(promises)
    const todosPedidos = resultadosArrays
      .flat()
      .sort((a, b) => new Date(b.data) - new Date(a.data))

    const totalValorDescontos = todosPedidos.reduce(
      (sum, ped) => sum + ped.totalDesconto,
      0
    )
    const quantidadeTotalItensDesconto = todosPedidos.reduce(
      (sum, ped) => sum + ped.quantidadeDescontos,
      0
    )

    return {
      setor: setor || 'geral',
      totalPedidos: todosPedidos.length,
      totalValorDescontos: Number(totalValorDescontos.toFixed(2)),
      quantidadeTotalItensDesconto: Number(quantidadeTotalItensDesconto.toFixed(2)),
      pedidos: todosPedidos,
    }
  }
}

export { ListarPedidosComDescontoServico }

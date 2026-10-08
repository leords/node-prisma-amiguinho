import prismaCliente from '../../prisma/index.js'

class ListarPendenciaServico {
  async executar({ status, clienteId, diasVencida, pedidoId } = {}) {
    const where = {}

    if (status) {
      const statusFormatado = String(status).trim().toLowerCase();
      if (statusFormatado === 'aberta' || statusFormatado === 'ativas' || statusFormatado === 'pendente') {
        where.status = { in: ['aberta', 'parcial'] }
      } else if (statusFormatado === 'somente_abertas') {
        where.status = { equals: 'aberta', mode: 'insensitive' }
      } else if (statusFormatado !== 'todos') {
        where.status = {
          equals: statusFormatado,
          mode: 'insensitive',
        }
      }
    }

    if (clienteId) {
      const idCli = Number(clienteId)
      if (!isNaN(idCli)) where.clienteId = idCli
    }

    if (pedidoId) {
      const idPed = Number(pedidoId)
      if (!isNaN(idPed)) where.pedidoId = idPed
    }

    if (diasVencida) {
      const dias = Number(diasVencida)
      if (!isNaN(dias)) {
        // Data limite: tudo que venceu há X dias ou mais
        const dataLimite = new Date()
        dataLimite.setDate(dataLimite.getDate() - dias)
        where.dataVencimento = {
          lte: dataLimite,
        }
      }
    }

    const pendencias = await prismaCliente.pendencia.findMany({
      where,
      include: {
        cliente: true,
        pedido: {
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
          },
        },
        pagamentos: {
          include: {
            formaPagamento: true,
            usuario: {
              select: { id: true, nome: true, usuario: true, nivelAcesso: true },
            },
          },
          orderBy: { data: 'desc' },
        },
      },
      orderBy: { dataVencimento: 'asc' },
    })

    const hoje = new Date()

    // Enriquece os dados com saldo devedor e dias de atraso
    const formatadas = pendencias.map((p) => {
      const saldoDevedor = Number((p.valor - p.valorPago).toFixed(2))
      const diffMs = hoje.getTime() - new Date(p.dataVencimento).getTime()
      const diasAtraso = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      return {
        ...p,
        saldoDevedor: Math.max(0, saldoDevedor),
        diasAtraso: diasAtraso > 0 ? diasAtraso : 0,
        estaVencida: diasAtraso > 0 && p.status !== 'fechada',
      }
    })

    return formatadas
  }
}

export { ListarPendenciaServico }

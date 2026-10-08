import prismaCliente from '../../prisma/index.js'

class ListarPagamentoServico {
  async executar({
    status,
    usuarioId,
    clienteId,
    pedidoId,
    pendenciaId,
    dataInicio,
    dataFim,
  } = {}) {
    const where = {}

    if (status) {
      where.status = {
        equals: String(status).trim(),
        mode: 'insensitive',
      }
    }

    if (usuarioId) {
      const idUser = Number(usuarioId)
      if (!isNaN(idUser)) where.usuarioId = idUser
    }

    if (pendenciaId) {
      const idPend = Number(pendenciaId)
      if (!isNaN(idPend)) where.pendenciaId = idPend
    }

    if (clienteId || pedidoId) {
      where.pendencia = {}
      if (clienteId) {
        const idCli = Number(clienteId)
        if (!isNaN(idCli)) where.pendencia.clienteId = idCli
      }
      if (pedidoId) {
        const idPed = Number(pedidoId)
        if (!isNaN(idPed)) where.pendencia.pedidoId = idPed
      }
    }

    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) {
        const inicio = new Date(dataInicio)
        inicio.setHours(0, 0, 0, 0)
        where.data.gte = inicio
      }
      if (dataFim) {
        const fim = new Date(dataFim)
        fim.setHours(23, 59, 59, 999)
        where.data.lte = fim
      }
    }

    const pagamentos = await prismaCliente.pagamento.findMany({
      where,
      include: {
        formaPagamento: true,
        usuario: {
          select: { id: true, nome: true, usuario: true, nivelAcesso: true },
        },
        pendencia: {
          include: {
            cliente: true,
            pedido: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    })

    return pagamentos
  }
}

export { ListarPagamentoServico }

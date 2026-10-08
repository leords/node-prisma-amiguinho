import prismaCliente from '../../prisma/index.js'

class ListarCargaServico {
  async executar({ dataInicio, dataFim, veiculoId, motoristaId, status } = {}) {
    const where = {}

    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) {
        // Se vier como YYYY-MM-DD, garante o início do dia no fuso horário do Brasil (-03:00)
        const strInicio =
          typeof dataInicio === 'string' && dataInicio.trim().length === 10
            ? `${dataInicio.trim()}T00:00:00-03:00`
            : dataInicio
        where.data.gte = new Date(strInicio)
      }
      if (dataFim) {
        // Se vier como YYYY-MM-DD, garante o fim do dia no fuso horário do Brasil (-03:00)
        const strFim =
          typeof dataFim === 'string' && dataFim.trim().length === 10
            ? `${dataFim.trim()}T23:59:59.999-03:00`
            : dataFim
        where.data.lte = new Date(strFim)
      }
    }

    if (veiculoId) {
      const idVeiculo = Number(veiculoId)
      if (!isNaN(idVeiculo)) where.veiculoId = idVeiculo
    }

    if (motoristaId) {
      const idMotorista = Number(motoristaId)
      if (!isNaN(idMotorista)) where.motoristaId = idMotorista
    }

    if (status) {
      where.status = {
        equals: String(status).trim(),
        mode: 'insensitive',
      }
    }

    const cargas = await prismaCliente.carga.findMany({
      where,
      include: {
        veiculo: true,
        motorista: true,
        usuario: {
          select: { id: true, nome: true, usuario: true },
        },
        pedidos: {
          include: {
            cliente: true,
            formaPagamento: true,
            itens: {
              include: {
                produto: true,
              },
            },
          },
        },
      },
      orderBy: { data: 'desc' },
    })

    return cargas
  }
}

export { ListarCargaServico }

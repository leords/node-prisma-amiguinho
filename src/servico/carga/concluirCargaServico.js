import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class ConcluirCargaServico {
  async executar({ id }) {
    const cargaId = Number(id)

    if (isNaN(cargaId)) {
      throw new AppError(
        ERRO_MSG_CARGA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    const carga = await prismaCliente.carga.findUnique({
      where: { id: cargaId },
      include: {
        pedidos: {
          include: {
            formaPagamento: true,
            cliente: true,
          },
        },
      },
    })

    if (!carga) {
      throw new AppError(
        ERRO_MSG_CARGA.NAO_ENCONTRADO,
        HTTP_STATUS_CODES.NOT_FOUND,
        'CARGA_NOT_FOUND'
      )
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      // 1. Altera o status da carga para 'finalizada'
      const cargaAtualizada = await prisma.carga.update({
        where: { id: cargaId },
        data: { status: 'finalizada' },
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
      })

      // 2. Identifica pedidos entregues com forma de pagamento no VALE
      const pedidosVale = (carga.pedidos || []).filter((p) => {
        // Não gerar pendência para pedidos devolvidos ou cancelados
        const statusPed = String(p.status || '').toLowerCase()
        if (statusPed === 'devolvido' || statusPed === 'cancelado') {
          return false
        }

        const nomeForma = (p.formaPagamento?.nome || '').toUpperCase()
        const tipoForma = (p.formaPagamento?.tipo || '').toUpperCase()
        return nomeForma.includes('VALE') || tipoForma.includes('VALE')
      })

      // 3. Cria automaticamente uma pendência para cada pedido no VALE entregue
      const pendenciasCriadas = []
      for (const pedido of pedidosVale) {
        if (!pedido.clienteId) continue

        const pendenciaExistente = await prisma.pendencia.findFirst({
          where: { pedidoId: pedido.id },
        })

        if (!pendenciaExistente) {
          const dataVencimento = new Date()
          dataVencimento.setDate(dataVencimento.getDate() + 7)

          const novaPendencia = await prisma.pendencia.create({
            data: {
              pedidoId: pedido.id,
              clienteId: pedido.clienteId,
              valor: Number(pedido.total || 0),
              valorPago: 0,
              status: 'aberta',
              dataVencimento,
            },
          })
          pendenciasCriadas.push(novaPendencia)
        }
      }

      return {
        ...cargaAtualizada,
        pendenciasGeradas: pendenciasCriadas.length,
        pendencias: pendenciasCriadas,
      }
    })

    return resultado
  }
}

export { ConcluirCargaServico }

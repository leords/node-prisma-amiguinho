import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class AdicionarPedidosCargaServico {
  async executar({ cargaId, pedidosIds }) {
    const idCarga = Number(cargaId)

    if (isNaN(idCarga)) {
      throw new AppError(
        ERRO_MSG_CARGA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
      )
    }

    if (!Array.isArray(pedidosIds) || pedidosIds.length === 0) {
      throw new AppError(
        ERRO_MSG_CARGA.SEM_PEDIDOS,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'SEM_PEDIDOS'
      )
    }

    const idsFormatados = pedidosIds.map(Number).filter((id) => !isNaN(id))
    if (idsFormatados.length === 0) {
      throw new AppError(
        ERRO_MSG_CARGA.SEM_PEDIDOS,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'SEM_PEDIDOS'
      )
    }

    const carga = await prismaCliente.carga.findUnique({
      where: { id: idCarga },
      include: {
        pedidos: {
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
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

    const statusCarga = String(carga.status || '').toLowerCase()
    if (statusCarga !== 'pendente') {
      throw new AppError(
        ERRO_MSG_CARGA.CARGA_NAO_PODE_RECEBER_PEDIDOS,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CARGA_NAO_PENDENTE'
      )
    }

    // Busca os novos pedidos a serem adicionados
    const novosPedidos = await prismaCliente.pedidoExterno.findMany({
      where: {
        id: { in: idsFormatados },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    if (novosPedidos.length !== idsFormatados.length) {
      throw new AppError(
        ERRO_MSG_CARGA.PEDIDO_NAO_ENCONTRADO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_NAO_ENCONTRADO'
      )
    }

    // Valida se algum pedido já está alocado em outra carga
    const pedidosEmOutraCarga = novosPedidos.filter(
      (p) => p.cargaId !== null && p.cargaId !== idCarga
    )
    if (pedidosEmOutraCarga.length > 0) {
      const idsConflito = pedidosEmOutraCarga.map((p) => p.id).join(', ')
      throw new AppError(
        `${ERRO_MSG_CARGA.PEDIDO_JA_EM_CARGA} (IDs: ${idsConflito})`,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_JA_EM_CARGA'
      )
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      // 1. Vincula os novos pedidos à carga e marca como 'carregado'
      await prisma.pedidoExterno.updateMany({
        where: {
          id: { in: idsFormatados },
        },
        data: {
          cargaId: idCarga,
          status: 'carregado',
        },
      })

      // 2. Busca todos os pedidos da carga consolidados para recalcular peso e quantidade
      const todosPedidos = await prisma.pedidoExterno.findMany({
        where: {
          cargaId: idCarga,
        },
        include: {
          itens: {
            include: {
              produto: true,
            },
          },
        },
      })

      let pesoTotal = 0
      for (const ped of todosPedidos) {
        for (const item of ped.itens) {
          const pesoUnitario = item.produto?.peso ? Number(item.produto.peso) : 0
          pesoTotal += Number(item.quantidade) * pesoUnitario
        }
      }

      // 3. Atualiza a carga
      const cargaAtualizada = await prisma.carga.update({
        where: { id: idCarga },
        data: {
          peso: Number(pesoTotal.toFixed(2)),
          quantidadePedido: todosPedidos.length,
        },
        include: {
          veiculo: true,
          motorista: true,
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

      return cargaAtualizada
    })

    return resultado
  }
}

export { AdicionarPedidosCargaServico }

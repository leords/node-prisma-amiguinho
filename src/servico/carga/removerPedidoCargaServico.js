import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class RemoverPedidoCargaServico {
  async executar({ cargaId, pedidoId }) {
    const idCarga = Number(cargaId)
    const idPedido = Number(pedidoId)

    if (isNaN(idCarga) || isNaN(idPedido)) {
      throw new AppError(
        ERRO_MSG_CARGA.TIPO_ID,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'TIPO_ID'
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
        ERRO_MSG_CARGA.CARGA_JA_EM_ROTA_OU_FINALIZADA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CARGA_NAO_PENDENTE'
      )
    }

    const pedido = carga.pedidos.find((p) => p.id === idPedido)
    if (!pedido) {
      throw new AppError(
        ERRO_MSG_CARGA.PEDIDO_NAO_PERTENCE_CARGA,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_NAO_PERTENCE_CARGA'
      )
    }

    const resultado = await prismaCliente.$transaction(async (prisma) => {
      // 1. Desvincula o pedido da carga e volta o status para 'pendente'
      await prisma.pedidoExterno.update({
        where: { id: idPedido },
        data: {
          cargaId: null,
          status: 'pendente',
        },
      })

      // 2. Recalcula o peso e a quantidade de pedidos restantes
      const pedidosRestantes = carga.pedidos.filter((p) => p.id !== idPedido)
      let novoPesoTotal = 0
      for (const ped of pedidosRestantes) {
        for (const item of ped.itens) {
          const pesoUnitario = item.produto?.peso ? Number(item.produto.peso) : 0
          novoPesoTotal += Number(item.quantidade) * pesoUnitario
        }
      }

      // 3. Atualiza a carga com o novo peso e quantidade
      const cargaAtualizada = await prisma.carga.update({
        where: { id: idCarga },
        data: {
          peso: Number(novoPesoTotal.toFixed(2)),
          quantidadePedido: pedidosRestantes.length,
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

export { RemoverPedidoCargaServico }

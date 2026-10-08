import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_PENDENCIA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarPendenciaServico {
  async executar({ clienteId, pedidoId, valor, diasVencimento = 7 }) {
    const idCliente = Number(clienteId)
    const idPedido = pedidoId ? Number(pedidoId) : null
    const valorTotal = Number(valor)

    if (isNaN(idCliente) || isNaN(valorTotal) || valorTotal <= 0) {
      throw new AppError(
        'Cliente e valor positivo são obrigatórios para a pendência',
        HTTP_STATUS_CODES.BAD_REQUEST,
        'DADOS_INVALIDOS'
      )
    }

    const cliente = await prismaCliente.clienteExterno.findUnique({
      where: { id: idCliente },
    })

    if (!cliente) {
      throw new AppError(
        'Cliente externo não encontrado',
        HTTP_STATUS_CODES.NOT_FOUND,
        'CLIENTE_NOT_FOUND'
      )
    }

    if (idPedido) {
      const pedido = await prismaCliente.pedidoExterno.findUnique({
        where: { id: idPedido },
      })
      if (!pedido) {
        throw new AppError(
          'Pedido externo não encontrado',
          HTTP_STATUS_CODES.NOT_FOUND,
          'PEDIDO_NOT_FOUND'
        )
      }
    }

    const dataVencimento = new Date()
    dataVencimento.setDate(dataVencimento.getDate() + Number(diasVencimento))

    const pendencia = await prismaCliente.pendencia.create({
      data: {
        clienteId: idCliente,
        pedidoId: idPedido,
        valor: valorTotal,
        valorPago: 0,
        status: 'aberta',
        dataVencimento,
      },
      include: {
        cliente: true,
        pedido: true,
        pagamentos: true,
      },
    })

    return pendencia
  }
}

export { CriarPendenciaServico }

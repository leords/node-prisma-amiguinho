import prismaCliente from '../../prisma/index.js'

class CancelarPedidoServico {
  async executar(uuid, setor) {
    try {
      if (setor === 'delivery') {
        const validarPedido = await prismaCliente.pedidoDelivery.findUnique({
          where: {
            uuid: uuid,
          },
          select: {
            status: true,
          },
        })

        if (!validarPedido) {
          throw new Error('Pedido não encontrado')
        }
        if (validarPedido === 'cancelado') {
          throw new Error('Este pedido já está cancelado')
        }

        await prismaCliente.pedidoDelivery.update({
          where: {
            uuid: uuid,
          },
          data: {
            status: 'cancelado',
          },
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }

      if (setor === 'externo') {
        const validarPedido = await prismaCliente.pedidoExterno.findUnique({
          where: {
            uuid: uuid,
          },
          select: {
            status: true,
          },
        })

        if (!validarPedido) {
          throw new Error('Pedido não encontrado')
        }
        if (validarPedido === 'cancelado') {
          throw new Error('Este pedido já está cancelado')
        }

        await prismaCliente.pedidoExterno.update({
          where: {
            uuid: uuid,
          },
          data: {
            status: 'cancelado',
          },
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }

      if (setor === 'balcao') {
        const validarPedido = await prismaCliente.pedidoBalcao.findUnique({
          where: {
            uuid: uuid,
          },
          select: {
            status: true,
          },
        })

        if (!validarPedido) {
          throw new Error('Pedido não encontrado')
        }
        if (validarPedido.status === 'cancelado') {
          throw new Error('Este pedido já está cancelado')
        }

        await prismaCliente.pedidoBalcao.update({
          where: {
            uuid: uuid,
          },
          data: {
            status: 'cancelado',
          },
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }
      throw new Error('Setor inválido')
    } catch (error) {
      throw error
    }
  }
}

export { CancelarPedidoServico }

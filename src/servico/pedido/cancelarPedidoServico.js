import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'
import { estornoEstoqueServico } from '../estoque/estornoEstoqueServico.js'

class CancelarPedidoServico {
  async executar(uuid, setor) {
    try {
      // SETOR DELIVERY
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
          throw new AppError(
            "edido não encontrado",
            HTTP_STATUS_CODES.NOT_FOUND,
            "PEDIDO_NOT_FOUND"
          )
        }
        if (validarPedido === 'cancelado') {
          throw new AppError(
            "Este pedido já está cancelado",
            HTTP_STATUS_CODES.NOT_FOUND,
            "PEDIDO_NOT_FOUND"
          )
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
      // SETOR DELIVERY
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
          throw new AppError(
            "edido não encontrado",
            HTTP_STATUS_CODES.NOT_FOUND,
            "PEDIDO_NOT_FOUND"
          )
        }
        if (validarPedido === 'cancelado') {
          throw new AppError(
            "Este pedido já está cancelado",
            HTTP_STATUS_CODES.NOT_FOUND,
            "PEDIDO_NOT_FOUND"
          )
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
      // SETOR BALCAO
      if (setor === 'balcao') {
        await prismaCliente.$transaction(async (tx) => {


          const validarPedido = await tx.pedidoBalcao.findUnique({
            where: {
              uuid: uuid,
            },
            select: {
              status: true,
            },
          })

          if (!validarPedido) {
            throw new AppError(
              "edido não encontrado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }
          if (validarPedido === 'cancelado') {
            throw new AppError(
              "Este pedido já está cancelado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }

          await tx.pedidoBalcao.update({
            where: {
              uuid: uuid,
            },
            data: {
              status: 'cancelado',
            },
          })

          const servico = new estornoEstoqueServico()
          await servico.executar(validarPedido, tx)

          return {
            mensagem: 'Pedido cancelado com sucesso',
          }

        })
      }

      throw new Error('Setor inválido')
    } catch (error) {
      throw error
    }
  }
}

export { CancelarPedidoServico }

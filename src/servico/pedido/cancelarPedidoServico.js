import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'
import { estornoEstoqueServico } from '../estoque/estornoEstoqueServico.js'

class CancelarPedidoServico {
  async executar(uuid, setor) {

    console.log('dados do controlador: ', uuid, setor)
    try {

       // SETOR DELIVERY
      if (setor === 'externo') {
        await prismaCliente.$transaction(async (tx) => {

          const validarPedido = await tx.pedidoExterno.findUnique({
            where: {
              uuid: uuid,
            }
          })

          if (!validarPedido) {
            throw new AppError(
              "Pedido não encontrado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }
          if (validarPedido.status === 'cancelado') {
            throw new AppError(
              "Este pedido já está cancelado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }

          await tx.pedidoExterno.update({
            where: {
              uuid: uuid,
            },
            data: {
              status: 'cancelado',
            },
          })

          const servico = new estornoEstoqueServico()
          await servico.executar(validarPedido.id, tx, 'externo')
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }

      // SETOR DELIVERY
      else if (setor === 'delivery') {
        await prismaCliente.$transaction(async (tx) => {

          const validarPedido = await tx.pedidoDelivery.findUnique({
            where: {
              uuid: uuid,
            }
          })

          if (!validarPedido) {
            throw new AppError(
              "Pedido não encontrado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }
          if (validarPedido.status === 'cancelado') {
            throw new AppError(
              "Este pedido já está cancelado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }

          await tx.pedidoDelivery.update({
            where: {
              uuid: uuid,
            },
            data: {
              status: 'cancelado',
            },
          })

          const servico = new estornoEstoqueServico()
          await servico.executar(validarPedido.id, tx, 'delivery')
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }

      // SETOR BALCAO
      else if (setor === 'balcao') {
        await prismaCliente.$transaction(async (tx) => {

          const validarPedido = await tx.pedidoBalcao.findUnique({
            where: {
              uuid: uuid,
            }
          })

          if (!validarPedido) {
            throw new AppError(
              "Pedido não encontrado",
              HTTP_STATUS_CODES.NOT_FOUND,
              "PEDIDO_NOT_FOUND"
            )
          }
          if (validarPedido.status === 'cancelado') {
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
          await servico.executar(validarPedido.id, tx, 'balcao')
        })

        return {
          mensagem: 'Pedido cancelado com sucesso',
        }
      }

      throw new Error('Setor inválido')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { CancelarPedidoServico }

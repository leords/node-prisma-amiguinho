import { ERRO_MSG_CLIENTE_DELIVERY } from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import prismaCliente from '../../prisma/index.js'

class LerClienteDeliveryServico {
  async executar(filtros) {
    const condicoes = {}

    if (filtros.id) {
      condicoes.id = Number(filtros.id)
    }
    if (filtros.nome) {
      condicoes.nome = filtros.nome.toUpperCase()
    }
    if (filtros.cidade) {
      condicoes.cidade = filtros.cidade.toUpperCase()
    }
    if (filtros.bairro) {
      condicoes.bairro = filtros.bairro.toUpperCase()
    }
    try {
      const clientes = await prismaCliente.clienteDelivery.findMany({
        where: condicoes,
      })

      if (!clientes) {
        throw new AppError(
          "Cliente não encontrado",
          HTTP_STATUS_CODES.NOT_FOUND,
          "CLIENTE_NOT_FOUND"
        )
      }

      return clientes
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { LerClienteDeliveryServico }

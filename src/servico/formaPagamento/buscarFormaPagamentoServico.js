import { ERRO_MSG_FORMA } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class BuscarFormaPagamentoServico {
  async executar(formas) {
    try {
      if (!formas || formas.length === 0) {
        throw new Error(ERRO_MSG_FORMA.NAO_ENCONTRADO)
      }

      for (const forma of formas) {
        await prismaCliente.formaPagamento.upsert({
          where: {
            id: forma.Id,
          },
          update: {
            nome: forma.Forma,
            status: forma.Status,
          },
          create: {
            id: forma.Id,
            nome: forma.Forma,
            status: forma.Status,
          },
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export { BuscarFormaPagamentoServico }

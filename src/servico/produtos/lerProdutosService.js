import { ERRO_MSG_PRODUTO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class LerProdutosservico {
  async executar(filtros) {
    const condicoes = {}

    // Valida e adiciona os filtros ao objeto!
    if (filtros.id) {
      condicoes.id = Number(filtros.id)
    }
    if (filtros.nome) {
      condicoes.nome = filtros.nome.toUpperCase()
    }
    if (filtros.fornecedor) {
      condicoes.fornecedor = filtros.fornecedor.toUpperCase()
    }
    if (filtros.segmento) {
      condicoes.segmento = filtros.segmento.toUpperCase()
    }

    try {
      const produtos = await prismaCliente.produto.findMany({
        where: condicoes,
      })

      if (!produtos) {
        throw new Error(ERRO_MSG_PRODUTO.NAO_ENCONTRADO)
      }

      return produtos
    } catch (error) {
      throw error
    }
  }
}

export { LerProdutosservico }

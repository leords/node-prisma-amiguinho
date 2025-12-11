import { ERRO_MSG_PRODUTO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class BuscarProdutosAPIServico {
  async executar(produtos) {
    try {
      if (!produtos || !produtos.length === 0) {
        throw new Error(ERRO_MSG_PRODUTO.NAO_ENCONTRADO)
      }
      for (const produto of produtos) {
        console.log(produtos)

        await prismaCliente.produto.upsert({
          where: {
            id: produto.ID,
          },
          update: {
            nome: String(produto.Nome),
            embalagem: produto.Embalagem,
            segmento: produto.Segmento,
            fornecedor: produto.Fornecedor,
            precoVenda: produto.PrecoVenda,
            precoCompra: produto.PrecoCompra ? Number(produto.PrecoCompra) : 0,
            peso: produto.Peso ? Number(produto.Peso) : 0,
            lucro: produto.Lucro ? Number(produto.Lucro) : 0,
            margem: produto.Margem ? Number(produto.Margem) : 0,
            quantidade: produto.Quantidade ? Number(produto.Quantidade) : 0,
            precoUndVenda: produto.PrecoUnd,
          },
          create: {
            id: produto.ID,
            nome: String(produto.Nome),
            embalagem: produto.Embalagem,
            segmento: produto.Segmento,
            fornecedor: produto.Fornecedor,
            precoVenda: produto.PrecoVenda,
            precoCompra: produto.PrecoCompra ? Number(produto.PrecoCompra) : 0,
            peso: produto.Peso ? Number(produto.Peso) : 0,
            lucro: produto.Lucro ? Number(produto.Lucro) : 0,
            margem: produto.Margem ? Number(produto.Margem) : 0,
            quantidade: produto.Quantidade ? Number(produto.Quantidade) : 0,
            precoUndVenda: produto.PrecoUnd,
          },
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export { BuscarProdutosAPIServico }

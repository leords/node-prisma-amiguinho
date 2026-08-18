import prismaCliente from "../../prisma/index.js";

class buscarProdutosAPIServico {
  async executar(produtos) {
    if (!produtos || produtos.length === 0) {
      throw new Error(ERRO_MSG_PRODUTO.NAO_ENCONTRADO);
    }

    const tamanhoLote = 50;

    for (let i = 0; i < produtos.length; i += tamanhoLote) {
      const lote = produtos.slice(i, i + tamanhoLote);

      await Promise.all(
        lote.map((produto) => {
          const dadosProduto = {
            nome: String(produto.Nome),
            embalagem: produto.Embalagem,
            segmento: produto.Segmento,
            fornecedor: produto.Fornecedor,
            precoVenda: produto.PrecoVenda,
            precoCompra: produto.PrecoCompra
              ? Number(produto.PrecoCompra)
              : 0,
            peso: produto.Peso
              ? Number(produto.Peso)
              : 0,
            lucro: produto.Lucro
              ? Number(produto.Lucro)
              : 0,
            margem: produto.Margem
              ? Number(produto.Margem)
              : 0,
            quantidade: produto.Quantidade
              ? Number(produto.Quantidade)
              : 0,
            precoUndVenda: produto.PrecoUnd,
          };

          return prismaCliente.produto.upsert({
            where: {
              id: produto.ID,
            },
            update: dadosProduto,
            create: {
              id: produto.ID,
              ...dadosProduto,
            },
          });
        })
      );

      console.log(
        `Sincronizados ${Math.min(i + tamanhoLote, produtos.length)} de ${produtos.length}`
      );
    }
  }
}


export { buscarProdutosAPIServico }
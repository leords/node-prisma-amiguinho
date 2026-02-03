import prismaCliente from "../../../prisma/index.js";

export const RelatorioMixProdutosExterno = async (vendedor, dataInicio, dataFim) => {

    const pedidos = await prismaCliente.pedidoExterno.findMany({
        // 1️⃣ Busca todos os pedidos de balcão
        // incluindo seus itens e produtos relacionados
            where: {
              vendedor: vendedor,
              data: {
                gte: dataInicio,
                lte: dataFim,
              },
            },
            include: {
              itens: {
                include: {
                  produto: true,
                },
              },
            },
          });

          const mixProdutos = {};


          // 2️⃣ Percorre cada pedido
          for (const pedido of pedidos) {
            //Produtos que saíram neste pedido
            const produtosDoPedido = pedido.itens.map(item => item.produto);


          // 3️⃣ Cria o cruzamento dos produtos
            for (let i = 0; i < produtosDoPedido.length; i++) {
              for (let j = 0; j < produtosDoPedido.length; j++) {

                if (i === j) continue; // Ignora o mesmo produto

                const produtoBase = produtosDoPedido[i].nome;
                const produtoRelacionado = produtosDoPedido[j].nome;

                //Inicializa estruturas se necessário
                if (!mixProdutos[produtoBase]) {
                  mixProdutos[produtoBase] = {};
                }

                if (!mixProdutos[produtoBase][produtoRelacionado]) {
                  mixProdutos[produtoBase][produtoRelacionado] = 0;
                }

                //Incrementa ocorrência, (1 por pedido).
                mixProdutos[produtoBase][produtoRelacionado]++;
              }
            }
          }

          return mixProdutos;
}
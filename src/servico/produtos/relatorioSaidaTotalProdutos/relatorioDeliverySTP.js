import prismaCliente from "../../../prisma/index.js"


export const RelatorioDeliverySTP = async (inicio, fim, produtoId) => {

        try {
            // Busca todos os itens/produto de pedidos com data especifica
            const produtos = await prismaCliente.ItemPedidoDelivery.findMany({
                where: {
                    produtoId: produtoId,
                    pedido: {
                    data: {
                        gte: inicio,
                        lte: fim
                    }
                    }
                },

                include: {
                    produto: true
                }
            })

            // Percorrendo o retorno de produtos um à um fazendo a soma manual
            const relatorio = {}

            produtos.forEach(item => {
            const nome = item.produto.nome

            // Se não encontrar, adicionar zerado!
            if (!relatorio[nome]) {
                relatorio[nome] = 0
            }

            // produto X recebe quantidade Y
            relatorio[nome] += item.quantidade
            })

            // Resultado: "BRAHMA LITRO": 10, "SKOL LITRO": 25, ... 


            // Tranformar em um array
            const resultado = Object.entries(relatorio).map(([produto, quantidade]) => ({
                produto,
                quantidade
            }))

            return resultado

        } catch (error) {
            console.log(error)
            throw error
        }
    }

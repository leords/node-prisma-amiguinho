import pedidoHelper from "./helpers/pedidoHelper.js";

class ExternoServico {


    executar(dados) {


        const pedidos =
            dados.pedidos.externo;


        const total =
            pedidoHelper.total(
                pedidos
            );


        const quantidadePedidos =
            pedidoHelper.quantidade(
                pedidos
            );


        const ticketMedio =
            pedidoHelper.ticketMedio(
                pedidos
            );


        const formasPagamento =
            this.#buscarFormasPagamento(
                pedidos,
                total
            );


        const vendedoresAgrupados =
            pedidoHelper.agruparPorVendedor(
                pedidos
            );


        const vendedores =
            Object.entries(vendedoresAgrupados)
                .map(

                    ([nome, pedidosVendedor]) => {

                        const totalVendedor =
                            pedidoHelper.total(
                                pedidosVendedor
                            );

                        const quantidade =
                            pedidoHelper.quantidade(
                                pedidosVendedor
                            );

                        return {
                            nome,
                            total: totalVendedor,
                            pedidos: quantidade,
                            ticketMedio:
                                pedidoHelper.ticketMedio(
                                    pedidosVendedor
                                ),
                            participacao:
                                this.#percentual(
                                    totalVendedor,
                                    total
                                )
                        };
                    }
                );


        vendedores.sort(
            (a, b) =>
                b.total - a.total
        );


        return {
            total,
            pedidos: quantidadePedidos,
            ticketMedio,
            formasPagamento,
            vendedores
        };
    }



    // FORMAS DE PAGAMENTO
    #buscarFormasPagamento(pedidos, totalVendas) {

        const formas = {};

        for (const pedido of pedidos) {
            const nome = pedido.formaPagamento.nome;

            if (!formas[nome]) {
                formas[nome] = 0;
            }

            formas[nome] += pedido.total;
        }



        return Object.entries(formas)
            .map(
                ([nome, valor]) => ({
                    nome,
                    valor,
                    percentual:
                        this.#percentual(
                            valor,
                            totalVendas
                        )
                })
            );
    }



    // PERCENTUAL
    #percentual(valor, total) {
        if (total === 0) {
            return 0;
        }
        return Number(((valor / total)*100).toFixed(2));
    }
}


export { ExternoServico }
import PedidoHelper from "./helpers/PedidoHelper.js";

class ExternoServico {


    executar(dados) {


        const pedidos =
            dados.pedidos.externo;


        const total =
            PedidoHelper.total(
                pedidos
            );


        const quantidadePedidos =
            PedidoHelper.quantidade(
                pedidos
            );


        const ticketMedio =
            PedidoHelper.ticketMedio(
                pedidos
            );


        const formasPagamento =
            this.#buscarFormasPagamento(
                pedidos,
                total
            );


        const vendedoresAgrupados =
            PedidoHelper.agruparPorVendedor(
                pedidos
            );


        const vendedores =
            Object.entries(vendedoresAgrupados)
                .map(

                    ([nome, pedidosVendedor]) => {


                        const totalVendedor =
                            PedidoHelper.total(
                                pedidosVendedor
                            );


                        const quantidade =
                            PedidoHelper.quantidade(
                                pedidosVendedor
                            );


                        return {

                            nome,

                            total:
                                totalVendedor,


                            pedidos:
                                quantidade,


                            ticketMedio:
                                PedidoHelper.ticketMedio(
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

            pedidos:
                quantidadePedidos,


            ticketMedio,


            formasPagamento,


            vendedores

        };


    }



    // ======================================================
    // FORMAS DE PAGAMENTO
    // ======================================================

    #buscarFormasPagamento(
        pedidos,
        totalVendas
    ) {


        const formas = {};


        for (const pedido of pedidos) {


            const nome =
                pedido.formaPagamento.nome;



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



    // ======================================================
    // PERCENTUAL
    // ======================================================

    #percentual(
        valor,
        total
    ) {


        if (total === 0) {

            return 0;

        }


        return Number(

            (
                (valor / total)
                *
                100

            ).toFixed(2)

        );


    }


}


export { ExternoServico }
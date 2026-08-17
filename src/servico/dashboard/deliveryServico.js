import pedidoHelper from "./helpers/pedidoHelper.js";


class DeliveryServico {

    executar(dados) {

        const pedidos = dados.pedidos.delivery;


        const pedidosEntregues =
            this.#filtrarPorStatus(
                pedidos,
                "entregue"
            );


        const total =
            pedidoHelper.total(
                pedidosEntregues
            );


        const quantidadePedidos =
            pedidoHelper.quantidade(
                pedidosEntregues
            );


        const ticketMedio =
            pedidoHelper.ticketMedio(
                pedidosEntregues
            );


        const formasPagamento =
            this.#buscarFormasPagamento(
                pedidosEntregues,
                total
            );


        const status = {

            pendentes:
                this.#quantidadeStatus(
                    pedidos,
                    "pendente"
                ),

            carregados:
                this.#quantidadeStatus(
                    pedidos,
                    "carregado"
                ),

            entregues:
                this.#quantidadeStatus(
                    pedidos,
                    "entregue"
                ),

            cancelados:
                this.#quantidadeStatus(
                    pedidos,
                    "cancelado"
                )

        };


        const tempoEntrega =
            this.#tempoMedioEntrega(
                pedidosEntregues
            );


        const tempoCarregamento =
            this.#tempoMedioCarregamento(
                pedidosEntregues
            );


        return {

            total,

            pedidos:
                quantidadePedidos,

            ticketMedio,

            formasPagamento,

            status,

            tempoEntrega,

            tempoCarregamento

        };

    }


    // ======================================================
    // FILTRA STATUS
    // ======================================================

    #filtrarPorStatus(pedidos, status) {

        return pedidos.filter(

            pedido =>
                pedido.status === status

        );

    }


    // ======================================================
    // QUANTIDADE POR STATUS
    // ======================================================

    #quantidadeStatus(pedidos, status) {

        return pedidos.filter(

            pedido =>
                pedido.status === status

        ).length;

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


        return Object.entries(formas).map(

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
    // TEMPO MÉDIO ENTRE CARREGAMENTO E ENTREGA
    // ======================================================

    #tempoMedioEntrega(pedidos) {


        const tempos = [];


        for (const pedido of pedidos) {


            if (
                !pedido.dataCarregada ||
                !pedido.dataEntrega
            ) {

                continue;

            }


            const inicio =
                new Date(
                    pedido.dataCarregada
                );


            const fim =
                new Date(
                    pedido.dataEntrega
                );


            const minutos =
                (fim - inicio) / 1000 / 60;


            tempos.push(minutos);


        }


        if (tempos.length === 0) {

            return 0;

        }


        return Number(

            (
                tempos.reduce(
                    (total, valor) =>
                        total + valor,
                    0
                )
                /
                tempos.length

            ).toFixed(2)

        );


    }


    // ======================================================
    // TEMPO MÉDIO ATÉ CARREGAR
    // ======================================================

    #tempoMedioCarregamento(pedidos) {


        const tempos = [];


        for (const pedido of pedidos) {


            if (
                !pedido.data ||
                !pedido.dataCarregada
            ) {

                continue;

            }


            const inicio =
                new Date(
                    pedido.data
                );


            const fim =
                new Date(
                    pedido.dataCarregada
                );


            const minutos =
                (fim - inicio) / 1000 / 60;


            tempos.push(minutos);


        }


        if (tempos.length === 0) {

            return 0;

        }


        return Number(

            (
                tempos.reduce(
                    (total, valor) =>
                        total + valor,
                    0
                )
                /
                tempos.length

            ).toFixed(2)

        );


    }


    // ======================================================
    // PERCENTUAL
    // ======================================================

    #percentual(valor, total) {


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


export { DeliveryServico }
import pedidoHelper from "./helpers/pedidoHelper.js";

class BalcaoServico {

    executar(dados) {

        const pedidos = dados.pedidos.balcao;
        const total = pedidoHelper.total(pedidos);
        const quantidadePedidos = pedidoHelper.quantidade(pedidos);
        const ticketMedio = pedidoHelper.ticketMedio(pedidos);
        const valeInterno = this.#buscarValeInterno(pedidos);
        const formasPagamento = this.#buscarFormasPagamento(
            pedidos,
            total
        );

        const vendedoresAgrupados = pedidoHelper.agruparPorVendedor(pedidos);

        const vendedores = Object.entries(vendedoresAgrupados).map(

            ([nome, pedidosVendedor]) => {

                const totalVendedor =
                    pedidoHelper.total(pedidosVendedor);

                const quantidade =
                    pedidoHelper.quantidade(pedidosVendedor);

                const ticket =
                    pedidoHelper.ticketMedio(pedidosVendedor);

                const valeInterno =
                    this.#buscarValeInterno(pedidosVendedor);

                return {
                    nome,
                    total: totalVendedor,
                    pedidos: quantidade,
                    ticketMedio: ticket,
                    participacao: this.#percentual(
                        totalVendedor,
                        total
                    ),
                    valeInterno
                };
            }
        );


        vendedores.sort(
            (a, b) => b.total - a.total
        );

        return {
            total,
            pedidos: quantidadePedidos,
            ticketMedio,
            valeInterno,
            formasPagamento,
            vendedores
        };

    }

    #buscarValeInterno(pedidos) {
        let total = 0;
        const lista = ['A VISTA', 'VALE', 'CARTÃO', 'CHEQUE', 'PIX']

        for (const pedido of pedidos) {

            for (const pagamento of pedido.pagamentos) {
                // Valido que apenas colete apenas formas de pagamento que represetam vales interno, ex: Leonardo, Gui, Emerson ...
                if (!lista.includes(pagamento.formaPagamento.nome)) { 
                    total += pagamento.valor;
                }
            }
        }
        return total;
    }


    #buscarFormasPagamento(pedidos, totalVendas) {
        const formas = {};
        const lista = ['A VISTA', 'VALE', 'CARTÃO', 'CHEQUE', 'PIX']

        for (const pedido of pedidos) {

            for (const pagamento of pedido.pagamentos) {
                // Valido que apenas as formas de pagamentos como a vista, pix, cartão, cheque e vale estão sendo calculadas.
                if(lista.includes(pagamento.formaPagamento.nome)) {
                    const nome = pagamento.formaPagamento.nome;
                    if (!formas[nome]) {
                        formas[nome] = 0;
                    }
                    formas[nome] += pagamento.valor;
                }
            }
        }

        return Object.entries(formas).map(
            ([nome, valor]) => ({
                nome,
                valor,
                percentual: this.#percentual(
                    valor,
                    totalVendas
                )
            })
        );
    }

    #percentual(valor, total) {
        if (total === 0) {
            return 0;
        }

        return Number(
            ((valor / total) * 100).toFixed(2)
        );
    }

}

export { BalcaoServico }
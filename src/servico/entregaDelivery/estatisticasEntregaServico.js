import prismaCliente from "../../prisma/index.js";

export class EstatisticasEntregaServico {

    /**
     * Calcula o tempo útil entre duas datas, considerando o expediente:
     * - 08:45 às 12:00
     * - 14:00 às 17:30
     *
     * @param {Date} dataInicio
     * @param {Date} dataFim
     * @returns {number} Tempo útil em minutos.
     */
    calcularTempoUtil(dataInicio, dataFim) {

        if (!dataInicio || !dataFim) {
            return 0;
        }

        let totalMinutos = 0;
        let atual = new Date(dataInicio);

        while (atual < dataFim) {

            const inicioDia = new Date(atual);
            inicioDia.setHours(0, 0, 0, 0);

            const inicioManha = new Date(inicioDia);
            inicioManha.setHours(8, 45, 0, 0);

            const fimManha = new Date(inicioDia);
            fimManha.setHours(12, 0, 0, 0);

            const inicioTarde = new Date(inicioDia);
            inicioTarde.setHours(14, 0, 0, 0);

            const fimTarde = new Date(inicioDia);
            fimTarde.setHours(17, 30, 0, 0);

            const inicioPeriodoManha = atual > inicioManha ? atual : inicioManha;
            const fimPeriodoManha = dataFim < fimManha ? dataFim : fimManha;

            if (inicioPeriodoManha < fimPeriodoManha) {
                totalMinutos += (fimPeriodoManha - inicioPeriodoManha) / 60000;
            }

            const inicioPeriodoTarde = atual > inicioTarde ? atual : inicioTarde;
            const fimPeriodoTarde = dataFim < fimTarde ? dataFim : fimTarde;

            if (inicioPeriodoTarde < fimPeriodoTarde) {
                totalMinutos += (fimPeriodoTarde - inicioPeriodoTarde) / 60000;
            }

            atual = new Date(inicioDia);
            atual.setDate(atual.getDate() + 1);
        }

        return Math.round(totalMinutos);
    }

    /**
     * Calcula a média de uma lista de tempos (minutos).
     *
     * @param {number[]} tempos
     * @returns {number}
     */
    _media(tempos) {
        if (tempos.length === 0) return 0;
        const total = tempos.reduce((soma, t) => soma + t, 0);
        return Math.round(total / tempos.length);
    }

    /**
     * Calcula as médias de tempo de entrega de um período.
     *
     * @param {Date} dataInicial
     * @param {Date} dataFinal
     * @returns {{
     *   tempoMedioTotal: number,
     *   tempoMedioPreparacao: number,
     *   tempoMedioEntrega: number,
     *   totalPedidos: number
     * }}
     */
    async executar(dataInicial, dataFinal) {

        const pedidos = await prismaCliente.pedidoDelivery.findMany({
            where: {
                status: "entregue",
                dataEntrega: {
                    gte: dataInicial,
                    lte: dataFinal,
                },
                dataCarregada: {
                    not: null,
                },
            },
            select: {
                data: true,
                dataCarregada: true,
                dataEntrega: true,
            },
        });

        if (pedidos.length === 0) {
            return {
                tempoMedioTotal: 0,
                tempoMedioPreparacao: 0,
                tempoMedioEntrega: 0,
                totalPedidos: 0,
            };
        }

        const temposTotal = [];
        const temposPreparacao = [];
        const temposEntrega = [];

        for (const pedido of pedidos) {

            temposTotal.push(
                this.calcularTempoUtil(pedido.data, pedido.dataEntrega)
            );

            temposPreparacao.push(
                this.calcularTempoUtil(pedido.data, pedido.dataCarregada)
            );

            temposEntrega.push(
                this.calcularTempoUtil(pedido.dataCarregada, pedido.dataEntrega)
            );
        }

        return {
            tempoMedioTotal: this._media(temposTotal),
            tempoMedioPreparacao: this._media(temposPreparacao),
            tempoMedioEntrega: this._media(temposEntrega),
            totalPedidos: pedidos.length,
        };
    }

}

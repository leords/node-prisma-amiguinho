import prismaCliente from "../../prisma/index.js";

export class EstatisticasEntregaServico {

    /**
     * Calcula o tempo útil de uma entrega.
     *
     * Horário de trabalho:
     * - 08:45 às 12:00
     * - 14:00 às 17:30
     *
     * Todo o tempo fora desses períodos é desconsiderado.
     *
     * @param {Date} dataCarregada
     * @param {Date} dataEntrega
     * @returns {number} Tempo útil em minutos.
     */
    calcularTempoEntrega(dataCarregada, dataEntrega) {

        // Caso alguma das datas não exista.
        if (!dataCarregada || !dataEntrega) {
            return 0;
        }

        let totalMinutos = 0;

        // Fazemos uma cópia para não alterar a data original.
        let atual = new Date(dataCarregada);

        // Percorre todos os dias envolvidos na entrega.
        while (atual < dataEntrega) {

            const inicioDia = new Date(atual);
            inicioDia.setHours(0, 0, 0, 0);

            // Expediente da manhã
            const inicioManha = new Date(inicioDia);
            inicioManha.setHours(8, 45, 0, 0);

            const fimManha = new Date(inicioDia);
            fimManha.setHours(12, 0, 0, 0);

            // Expediente da tarde
            const inicioTarde = new Date(inicioDia);
            inicioTarde.setHours(14, 0, 0, 0);

            const fimTarde = new Date(inicioDia);
            fimTarde.setHours(17, 30, 0, 0);

            // Soma os minutos do período da manhã.
            const inicioPeriodoManha =
                atual > inicioManha ? atual : inicioManha;

            const fimPeriodoManha =
                dataEntrega < fimManha ? dataEntrega : fimManha;

            if (inicioPeriodoManha < fimPeriodoManha) {
                totalMinutos +=
                    (fimPeriodoManha - inicioPeriodoManha) / 60000;
            }

            // Soma os minutos do período da tarde.
            const inicioPeriodoTarde =
                atual > inicioTarde ? atual : inicioTarde;

            const fimPeriodoTarde =
                dataEntrega < fimTarde ? dataEntrega : fimTarde;

            if (inicioPeriodoTarde < fimPeriodoTarde) {
                totalMinutos +=
                    (fimPeriodoTarde - inicioPeriodoTarde) / 60000;
            }

            // Avança para o próximo dia.
            atual = new Date(inicioDia);
            atual.setDate(atual.getDate() + 1);
        }

        return Math.round(totalMinutos);
    }

    /**
     * Calcula as estatísticas de entrega de um período.
     *
     * @param {Date} dataInicial
     * @param {Date} dataFinal
     * @returns {{
     *   mediaMinutos: number,
     *   menorTempo: number,
     *   maiorTempo: number,
     *   totalPedidos: number,
     *   totalMinutos: number
     * }}
     */
    async executar(dataInicial, dataFinal) {

        console.log('datas vindo no controlador: ', dataInicial, dataFinal)

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
                dataCarregada: true,
                dataEntrega: true,
            },
        });

        console.log('pedidos para minutos: ', pedidos)

        // Nenhum pedido encontrado.
        if (pedidos.length === 0) {
            return {
                mediaMinutos: 0,
                menorTempo: 0,
                maiorTempo: 0,
                totalPedidos: 0,
                totalMinutos: 0,
            };
        }

        let totalMinutos = 0;
        let menorTempo = Number.MAX_SAFE_INTEGER;
        let maiorTempo = 0;

        for (const pedido of pedidos) {

            const minutos = this.calcularTempoEntrega(
                pedido.dataCarregada,
                pedido.dataEntrega
            );

            totalMinutos += minutos;

            if (minutos < menorTempo) {
                menorTempo = minutos;
            }

            if (minutos > maiorTempo) {
                maiorTempo = minutos;
            }
        }

        return {
            mediaMinutos: Number((totalMinutos / pedidos.length).toFixed(1)),
            menorTempo,
            maiorTempo,
            totalPedidos: pedidos.length,
            totalMinutos,
        };
    }

}
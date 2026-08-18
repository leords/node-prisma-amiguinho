
import { DashboardRepositorio } from "./dashboardRepositorio.js";
import { GeralServico } from "./geralServico.js";
import { BalcaoServico } from "./balcaoServico.js";
import { DeliveryServico } from "./deliveryServico.js";
import { ExternoServico } from "./externoServico.js";

class DashboardServico {

    async executar(filtro) {

        // formatando datas vindo por parametro.
        const inicio = new Date(`${filtro.dataInicio}T00:00:00-03:00`);
        const fim = new Date(`${filtro.dataFim}T23:59:59.999-03:00`);
        fim.setUTCDate(fim.getUTCDate() + 1);


        const repositorio = new DashboardRepositorio();

        // validar as datas para buscar os pedidos corretos do dia! 
        const dados = await repositorio.buscarPedidos(
            inicio,
            fim
        );

        const servicoGeral = new GeralServico();
        const geral = servicoGeral.executar(dados);

        const servicoBalcao = new BalcaoServico();
        const balcao = servicoBalcao.executar(dados);

        const servicoDelivery = new DeliveryServico();
        const delivery = servicoDelivery.executar(dados);


        const servicoExterno = new ExternoServico();
        const externo = servicoExterno.executar(dados);

        const resumo = {
            setores: 3,
            pedidos: 
                geral.quantidadePedidos,
            faturamento: 
                geral.totalVendas
        };

    
        return {
            atualizadoEm: new Date(),
            filtro,
            resumo,
            geral,
            balcao,
            delivery,
            externo
        };

    }

}

export { DashboardServico }
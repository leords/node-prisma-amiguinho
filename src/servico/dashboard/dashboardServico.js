
import { DashboardRepositorio } from "./dashboardRepositorio.js";
import { GeralServico } from "./geralServico.js";
import { BalcaoServico } from "./balcaoServico.js";
import { DeliveryServico } from "./deliveryServico.js";
import { ExternoServico } from "./externoServico.js";

class DashboardServico {

    async executar(filtro) {

        const repositorio = new DashboardRepositorio();

        const dados = await repositorio.buscarPedidos(
            filtro.dataInicio,
            filtro.dataFim
        );

        const servicoGeral = new GeralServico();
        const geral = servicoGeral.executar(dados);

        const servicoBalcao = new BalcaoServico();
        const balcao = servicoBalcao.executar(dados);

        const servicoDelivery = new DeliveryServico();
        const delivery = servicoDelivery.executar(dados);

        //console.log('Debug dashboard: ', delivery)


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
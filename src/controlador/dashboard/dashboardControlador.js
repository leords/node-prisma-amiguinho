import { DashboardServico } from "../../servico/dashboard/dashboardServico.js";


class DashboardControlador {

    async tratar(req, res) {

        const { dataInicio, dataFim } = req.query;

        console.log('DEBUG DATAS: ', dataInicio, ':', dataFim)

        const servico = new DashboardServico();

        const resultado = await servico.executar({
            dataInicio,
            dataFim
        });


        return res.json(resultado);
    }

}

export { DashboardControlador };
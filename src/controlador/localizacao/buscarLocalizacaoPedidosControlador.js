import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import { AppError } from "../../error/appError.js";
import { buscarLocalizacaoPedidosServico } from "../../servico/localizacao/buscarLocalizacaoPedidosServico.js";

class buscarLocalizacaoPedidosControlador {

    async tratar(req, res, next) {
        const { dataInicio, dataFim, clienteId, usuarioId } = req.body

        try {
            if(!dataInicio || !dataFim) {
                throw new AppError(
                    'Data de inicio e fim é obrigatório',
                    HTTP_STATUS_CODES.NOT_FOUND,
                    'INTERVALO_DATA_NOT_FOUND'
                )
            }

            if(clienteId && isNaN(clienteId)) {
                throw new AppError(
                    'Data de inicio e fim é obrigatório',
                    HTTP_STATUS_CODES.NOT_FOUND,
                    'CLIENTE_NOT_FOUND'
                )
            }

            if(usuarioId && isNaN(usuarioId)) {
                throw new AppError(
                    'Data de inicio e fim é obrigatório',
                    HTTP_STATUS_CODES.NOT_FOUND, 
                )
            }
            
            const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
            const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

            const servico = new buscarLocalizacaoPedidosServico();
            const resultado = await servico.executar(inicio, fim, clienteId, usuarioId)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error);
            next(error)
        }

    }
}

export { buscarLocalizacaoPedidosControlador }
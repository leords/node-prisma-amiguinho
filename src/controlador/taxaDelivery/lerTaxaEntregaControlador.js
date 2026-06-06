import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { lerTaxaEntregaServico } from "../../servico/taxaDelivery/lerTaxaEntregaServico.js";


class lerTaxaEntregaControlador {
    async tratar(req, res, next) {

        try {
            const servico = new lerTaxaEntregaServico();
            const resultado = await servico.executar();

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { lerTaxaEntregaControlador }
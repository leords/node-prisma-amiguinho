import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { lerCaixaServico } from "../../servico/caixa/lerCaixaServico.js"


class lerCaixaControlador {
    async tratar(req, res, next) {

        try {
            const servico = new lerCaixaServico();
            const resultado = await servico.executar();

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { lerCaixaControlador }
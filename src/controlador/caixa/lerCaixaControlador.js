import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes"
import { AppError } from "../../error/appError"
import { lerCaixaServico } from "../../servico/caixa/lerCaixaServico"


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
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { alterarCaixaServico } from "../../servico/caixa/alterarCaixaServico.js"

class alterarCaixaControlador {

    async tratar(req, res, next) {

        const { valor } = req.body

        try {
            
            if(!valor || isNaN(valor)) {
                throw new AppError(
                    "valor é obrigatório e deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VALOR_BAD_REQUEST" 
                )
            }

            const servico = new alterarCaixaServico();
            const resultado = await servico.executar(valor)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)


        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}

export { alterarCaixaControlador }
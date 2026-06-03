import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { alterarCaixaServico } from "../../servico/caixa/alterarCaixaServico.js"

class alterarCaixaControlador {

    async tratar(req, res, next) {
        const { valor } = Number(req.body)
    

        try {

            const valorNumero = Number(valor)
            
            if(isNaN(valorNumero)) {
                throw new AppError(
                    "valor é obrigatório e deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VALOR_BAD_REQUEST" 
                )
            }

            const servico = new alterarCaixaServico();
            await servico.executar(valorNumero)

            return res.status(HTTP_STATUS_CODES.OK).json({
                sucesso: true, 
                mensagem: 'Inicio de caixa alterado com sucesso!'
            })


        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}

export { alterarCaixaControlador }
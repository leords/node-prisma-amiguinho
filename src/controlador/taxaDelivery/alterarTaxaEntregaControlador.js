import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { alterarTaxaEntregaServico } from "../../servico/taxaDelivery/alterarCaixaServico.js";

class alterarTaxaEntregaControlador {

    async tratar(req, res, next) {
        const { valor } = req.body;
    
        try {

            const valorNumero = Number(valor)

            if(isNaN(valorNumero)) {
                throw new AppError(
                    "valor é obrigatório e deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VALOR_BAD_REQUEST" 
                )
            }

            const servico = new alterarTaxaEntregaServico();
            await servico.executar(valorNumero)

            return res.status(HTTP_STATUS_CODES.OK).json({
                sucesso: true, 
                mensagem: 'Taxa de entrega alterada com sucesso!'
            })


        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}

export { alterarTaxaEntregaControlador }
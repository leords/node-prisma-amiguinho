import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { BuscarEstoqueServico } from "../../servico/estoque/buscarEstoqueServico.js"
import { AppError } from "../../error/appError.js"


class BuscarEstoqueControlador {
    async tratar(req, res, next) {

        const produtoId = req.query.produto ? req.query.produto : undefined
        
        try {
            if(produtoId && isNaN(produtoId)) {
                throw new AppError(
                    "Produto deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST, 
                    "TIPO_PRODUTO_BAD_REQUEST"
                )
            }
            
            const servico = new BuscarEstoqueServico()
            const resultado = await servico.executar(produtoId)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { BuscarEstoqueControlador }
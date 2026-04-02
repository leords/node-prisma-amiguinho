import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes"
import { AppError } from "../../error/appError"
import { EntradaEstoqueServico } from "../../servico/estoque/entrada/entradaEstoqueServico"

class EntradaEstoqueControlador {
    async tratar(req, res, next) {

        const id = req.params.id
        const quantidade = req.body.quantidade

        try {
            // VALIDANDO ID.
            if(!id) {
                throw new AppError(
                    "ID é obrigatório",   
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_NOT_FOUND"
                )
            }
            if(isNaN(id)) {
                throw new AppError(
                    "ID deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }
            // VALIDANDO QUANTIDADE.
            if(!quantidade) {
                throw new AppError(
                    "Quantidade é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "QUANTIDADE_NOT_FOUND"
                )
            }
            if(isNaN(quantidade)) {
                throw new AppError(
                    "Quantidade deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "QUANTIDADE_BAD_REQUEST"
                )
            }

            const servico = new EntradaEstoqueServico()
            const resultado = await servico.executar(id, quantidade)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { EntradaEstoqueControlador }
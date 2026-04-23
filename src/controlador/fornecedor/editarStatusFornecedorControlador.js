import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarStatusFornecedorServico } from "../../servico/fornecedor/editarStatusFornecedorServico.js"

class EditarStatusFornecedorControlador {
    async tratar (req, res, next) {

        const id = Number(req.params.id)

        try {
            if(!id) {
                throw new AppError (
                    "ID é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_NOT_FOUND"
                )
            }

            if(isNaN(id)) {
                throw new AppError (
                    "ID deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }

            const servico = new EditarStatusFornecedorServico()
            const resultado = await servico.executar(id)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { EditarStatusFornecedorControlador }
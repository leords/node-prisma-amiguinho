import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarFornecedorServico } from "../../servico/fornecedor/editarFornecedorServico.js"

class EditarFornecedorControlador {
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

            const servico = new EditarFornecedorServico()
            const resultado = await servico.executar(id)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { EditarFornecedorControlador }
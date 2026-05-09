import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { DeletarFechamentoServico } from "../../servico/fechamento/deletarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class DeletarFechamentoControlador {
    async tratar(req, res, next) {
        const id = Number(req.params.id)

        try {
            if(!id) {
                throw new AppError(
                    "Id é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }
            if(isNaN(id)) {
                throw new AppError(
                    "Id deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }

            const servico = new DeletarFechamentoServico()
            const resultado = await servico.executar(id)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { DeletarFechamentoControlador }
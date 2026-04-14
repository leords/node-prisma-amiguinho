import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { ListarFornecedorServico } from "../../servico/fornecedor/listarFornecedorServico.js"

class ListarFornecedorControlador {
    async tratar(req, res, next) {

        const status = req.query.status ? req.query.status : undefined

        if(status && typeof status !== 'string') {
            throw new AppError(
                "Status deve ser um texto",
                HTTP_STATUS_CODES.BAD_REQUEST,
                "STATUS_TIPO_ERRO"
            )
        }

        try {
            const servico = new ListarFornecedorServico()
            const resultado = await servico.executar(status)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { ListarFornecedorControlador }
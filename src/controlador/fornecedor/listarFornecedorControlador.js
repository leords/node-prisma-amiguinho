import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { ListarFornecedorServico } from "../../servico/fornecedor/listarFornecedorServico.js"

class ListarFornecedorControlador {
    async tratar(req, res, next) {
        try {
            const servico = new ListarFornecedorServico()
            const resultado = await servico.executar()

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { ListarFornecedorControlador }
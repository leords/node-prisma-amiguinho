import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarFornecedorServico } from "../../servico/fornecedor/editarFornecedorServico.js"

class EditarFornecedorControlador {


    async tratar(req, res, next) {
         const id = Number(req.params.id)
         const vendedor = req.query.vendedor ? req.query.vendedor : undefined
         const telefone = req.query.telefone ? req.query.telefone : undefined


        // validando a existencia apenas de números na variável
        const apenasNumeros = (valor) => /^\d+$/.test(valor)

         try {

            if(!id) {
                throw new AppError(
                    "Id é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "ID_NOT_FOUND"
                )
            }
            if(isNaN(id)) {
                throw new AppError(
                    "Id deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }
            if(vendedor && typeof vendedor !== 'string') {
                throw new AppError(
                    "Vendedor deve ser do tipo texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VENDEDOR_BAD_REQUEST"
                )    
            }
            if(telefone && typeof telefone !== 'string') {
                throw new AppError(
                    "Telefone deve ser do tipo texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TELEFONE_BAD_REQUEST"
                )    
            }
            if(telefone && !apenasNumeros(telefone)) {
                throw new AppError(
                    "Telefone aceita apenas números",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TELEFONE_BAD_REQUEST"
                )
            }

            const servico = new EditarFornecedorServico()
            const resultado = await servico.executar(id, vendedor, telefone)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
         } catch (error) {
            console.log(error)
            next(error)
         }
    }
}

export { EditarFornecedorControlador }
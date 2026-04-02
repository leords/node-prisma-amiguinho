import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { CriarFornecedorServico } from "../../servico/fornecedor/criarFornecedorServico.js"
import { validarCNPJ } from "../../utilidades/validarCNPJ.js"

class CriarFornecedorControlador {
    async tratar(req, res, next) {
        
        console.log('entrei')

        const nome = req.body.nome
        const cnpj = req.body.cnpj

        try {
            if(!nome) {
                throw new AppError(
                    "Nome é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "NOME_NOT_FOUND"
                )
            }
            if(!cnpj) {
                throw new AppError(
                    "CNPJ é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "CNPJ_NOT_FOUND"
                )
            }
            if(typeof nome !== "string") {
                throw new AppError(
                    "Nome ser um texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "NOME_BAD_REQUEST"
                )
            }
            if(isNaN(cnpj)) {
                throw new AppError(
                    "CNPJ deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "CNPJ_BAD_REQUEST"
                )
            }

            // validando CNPJ pela função especifica.
            const CNPJvalido = validarCNPJ(cnpj);

            if(!CNPJvalido) {
                throw new AppError(
                    "CNPJ inválido",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "CNPJ_INVALID"
                ) 
            }


            const servico = new CriarFornecedorServico()
            const resultado = await servico.executar(nome, cnpj)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)


        } catch (error) {
            console.log(error)
            next(error) 
        }
    }
}

export { CriarFornecedorControlador }
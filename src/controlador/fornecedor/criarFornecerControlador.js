import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { CriarFornecedorServico } from "../../servico/fornecedor/criarFornecedorServico.js"
import { validarCNPJ } from "../../utilidades/validarCNPJ.js"

class CriarFornecedorControlador {
    async tratar(req, res, next) {
        

        const nome = req.body.nome
        const cnpj = req.body.cnpj
        const telefone = req.body.telefone
        const vendedor = req.body.vendedor

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
            if(!telefone) {
                throw new AppError(
                    "Telefone é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TELEFONE_NOT_FOUND"
                )
            }

            // valildando a existencia apenas de números na variável
            const apenasNumeros = (valor) => /^\d+$/.test(valor)
            if(!apenasNumeros(telefone)) {
                throw new AppError(
                    "Telefone deve conter apenas números",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TELEFONE_BAD_REQUEST"
                )
            }

            
            if(!vendedor) {
                throw new AppError(
                    "Vendedor é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TELEFONE_BAD_REQUEST"
                )
            }
            if( typeof vendedor !== "string") {
                throw new AppError(
                    "Vendedor deve ser texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VENDEDOR_NOT_FOUND"
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
            const resultado = await servico.executar(nome, cnpj, telefone, vendedor)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)


        } catch (error) {
            console.log(error)
            next(error) 
        }
    }
}

export { CriarFornecedorControlador }
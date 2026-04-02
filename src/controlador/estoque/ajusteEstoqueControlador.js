import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { AjusteEstoqueServico } from "../../servico/estoque/ajusteEstoqueServico.js"

class AjusteEstoqueControlador {
    async tratar(req, res, next) {

        const produtoId = Number(req.params.produtoId)
        const { quantidade, usuarioId, tipo } = req.body


        const opcoes = ['ENTRADA', 'SAIDA'];


        try {

            if(!opcoes.includes(tipo)) {
                throw new AppError(
                    "São aceitos somente os tipos: ENTRADA e SAIDA",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_BAD_REQUEST"
                )
            }

            if(!produtoId) {
                throw new AppError(
                    "ProdutoId é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PRODUTOID_NOT_FOUND"
                )
            }

            if(isNaN(produtoId)) {
                throw new AppError(
                    "ProdutoId deve ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "PRODUTOID_BAD_REQUEST"
                )
            }

            if(!quantidade) {
                throw new AppError(
                    "Quantidade é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PRODUTOID_NOT_FOUND"
                )
            }

            if(isNaN(quantidade)) {
                throw new AppError(
                    "Quantidade deve ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "PRODUTOID_BAD_REQUEST"
                )
            }

            if(!usuarioId) {
                throw new AppError(
                    "UsuarioId é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PRODUTOID_NOT_FOUND"
                )
            }

            if(isNaN(usuarioId)) {
                throw new AppError(
                    "Quantidade deve ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "PRODUTOID_BAD_REQUEST"
                )
            }

            const servico = new AjusteEstoqueServico();
            const resultado = await servico.executar(produtoId, quantidade, usuarioId, tipo)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error)
            next(error)
        }

    }
}

export { AjusteEstoqueControlador }
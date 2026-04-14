import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { CriarOrdemCompraServico } from "../../servico/ordemCompra/criarOrdemCompraServico.js"


class CriarOrdemCompraControlador { 
    async tratar(req, res, next) {

        const { 
            usuarioId,
            fornecedorId,
            itens
        } = req.body

        try {
            // valida usuário
            if(!usuarioId) {
                throw new AppError(
                    "UsuárioId é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "USUÁRIO_NOT_FOUND"
                )
            }
            // valida fornecedor
            if(!fornecedorId) {
                throw new AppError(
                    "Fornecedor é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "FONECEDOR_NOT_FOUND"
                )
            }
            // validando itens
            if(!Array.isArray(itens) || itens.length === 0) {
                throw new AppError(
                    "Itens está vazio",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "ITENS_NOT_FOUND"
                )
            }

            const itensValidados = itens.map((item, index) => {
                //validando variáveis de cada item
                const produtoId = Number(item.produtoId)
                const quantidade = Number(item.quantidade)
                const precoCompra = Number(item.valorUnit)

                if(isNaN(produtoId)) {
                    throw new AppError(
                        `Item ${index + 1}: produtoId inválido`,
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "PRODUTO_ID_NOT_FOUND"
                    )
                }

                if(isNaN(quantidade)) {
                    throw new AppError(
                    `Item ${index + 1}: quantidade inválida`,
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "QUANTIDADE_ID_NOT_FOUND"
                    )
                }

                if(isNaN(precoCompra)) {
                    throw new AppError(
                    `Item ${index + 1}: Preco de compra inválido`,
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PRECO_COMPRA_NOT_FOUND"
                    )
                }

                return {
                    ...item,
                    produtoId,
                    quantidade,
                    precoCompra,
                }
            })

            const servico = new CriarOrdemCompraServico();
            const resultado = await servico.executar(usuarioId, fornecedorId, itensValidados);

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }

    }
}

export { CriarOrdemCompraControlador }
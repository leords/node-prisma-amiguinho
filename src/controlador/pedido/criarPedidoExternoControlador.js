import { ERRO_MSG_PEDIDOS, HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { criarPedidoExternoServico } from "../../servico/pedido/criarPedidoExternoServico.js"


class criarpedidoExternoControlador {
    async tratar(req, res, next) {

        const { pedidos } = req.body

        try {

            if(!pedidos || !Array.isArray(pedidos) || pedidos.length === 0) {
                throw new AppError (
                    'Lista de pedidos é obrigatória',
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "LISTA_LOCALIZACOES_NOT_FOUND"
                )
            }

            // Converte e valida a tipagem dos campos.
            const listaPedidos = pedidos.map((pedido, index) => {
                //convertendo para números;
                const clienteId = Number(pedido.clienteId)
                const formaPagamentoId = Number(pedido.formaPagamentoId)
                const usuarioId = Number(pedido.usuarioId)

                if (!pedido.uuid) {
                    throw new AppError(
                        "UUID do pedido é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "UUID_NOT_FOUND"
                    );
                }


                // validando a tipagem dos dados.
                if (!pedido.data) {
                    throw new AppError(
                        "Data do pedido é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "DATA_NOT_FOUND"
                    );
                }

                if (!Number.isFinite(clienteId)) {
                    throw new AppError(
                        "ClienteId é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "CLIENTE_ID_NOT_FOUND"
                    )
                }

                if (!Number.isFinite(formaPagamentoId)) {
                    throw new AppError(
                        "Forma de pagamento é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "PRECISAO_NOT_FOUND"
                    )
                }

                if (!Number.isFinite(usuarioId)) {
                    throw new AppError(
                        "UsuárioId é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "USUARIO_ID_NOT_FOUND"
                    )
                } 
                

                if(!Array.isArray(pedido.itens) || pedido.itens.length === 0) {
                    throw new AppError(
                        "Itens é obrigatório",
                        HTTP_STATUS_CODES.BAD_REQUEST,
                        "PEDIDOS_NOT_FOUND"
                    )
                }

                // Valida a existencia de um por um dos campos dos itens da lista.
                pedido.itens.forEach((item) => {
                    if (
                        !Number.isFinite(Number(item.produtoId)) ||
                        !Number.isFinite(Number(item.quantidade)) ||
                        !Number.isFinite(Number(item.valorUnit))
                    ) {
                        throw new AppError(
                            ERRO_MSG_PEDIDOS.CAMPO_AUSENTE,
                            HTTP_STATUS_CODES.BAD_REQUEST,
                            "PRODUTO_NOT_FOUND"
                        )
                    }
                })

                // retornando o objeto atual e as alterações
                return {
                    ...pedido,
                    clienteId,
                    formaPagamentoId,
                    usuarioId,
                }
            })

            const servico = new criarPedidoExternoServico();
            const resultado = await servico.executar(listaPedidos);

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { criarpedidoExternoControlador }
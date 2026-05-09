import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarPedidoServico } from "../../servico/pedido/editarPedido/editarPedidoServico.js"

class EditarPedidoControlador {
 async tratar(req, res, next) {

    try {
        const { setor, uuid } = req.params
        const formaPagamentoId = req.query.formaPagamentoId ? Number(req.query.formaPagamentoId) : undefined
        const dados = req.body

        if(!setor) {
            throw new AppError(
                'Setor é obrigatório',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "SETOR_NOT_FOUND"
            )
        }

        const opcaoSetor = ['delivery', 'externo', 'balcao']
        if (!opcaoSetor.includes(setor)) {
            throw new AppError(
                'Setor inválido',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "SETOR_NOT_FOUND"
            )
        }
        
        if(uuid && typeof uuid !== 'string') {
            throw new AppError(
                'UUID é obrigatório',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "UUID_NOT_FOUND"
            )
        }
        
        if(formaPagamentoId && isNaN(formaPagamentoId)) {
            throw new AppError(
                'Forma de pagamento precisa ser um número',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "FORMA_PAGAMENTO_NOT_FOUND"
            )
        }
        if(dados && typeof dados.length === 0) {
            throw new AppError(
                'Dados é obrigatório',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "DADOS_NOT_FOUND"
            )
        }

        const servico = new EditarPedidoServico()
        await servico.executar(setor, uuid, formaPagamentoId, dados);
        return res.status(HTTP_STATUS_CODES.OK).json({
            sucesso: true,
            mensagem: 'Pedido editado com sucesso'
        })

    } catch (error) {
         console.log(error)
         next(error)
    }
 }
}

export { EditarPedidoControlador }
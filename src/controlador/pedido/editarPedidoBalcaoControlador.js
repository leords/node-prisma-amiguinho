import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarPedidoBalcao } from "../../servico/pedido/editarPedido/editarPedidoBalcao.js"

class EditarPedidoBalcaoControlador {
 async tratar(req, res, next) {

    try {
        const { uuid } = req.params
        const {pagamentos, dados} = req.body

        if(uuid && typeof uuid !== 'string') {
            throw new AppError(
                'UUID é obrigatório',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "UUID_NOT_FOUND"
            )
        }
        
        if(pagamentos && typeof pagamentos.length === 0) {
            throw new AppError(
                'formas Pagamentos deve ser um array',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "DADOS_NOT_FOUND"
            )
        }
        if(dados && typeof dados.length === 0) {
            throw new AppError(
                'Dados deve ser array',
                HTTP_STATUS_CODES.BAD_REQUEST,
                "DADOS_NOT_FOUND"
            )
        }

        const servico = new EditarPedidoBalcao()
        await servico.executar(uuid, pagamentos, dados);
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

export { EditarPedidoBalcaoControlador }
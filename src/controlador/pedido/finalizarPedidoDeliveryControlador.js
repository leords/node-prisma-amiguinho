import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { finalizarPedidoDeliveryServico } from "../../servico/pedido/finalizarPedidoDeliveryServico.js"


class finalizarPedidoDeliveryControlador {
    async tratar(req, res, next) {

        const uuid = req.params.uuid
        const status = req.body.status
        const lat = req.body.lat
        const long = req.body.long
        const precisao = req.body.precisao
        const formaPagamentoId = req.body.formaPagamentoId

        console.log('dados vindo da REQ: ', uuid, status, lat, long, precisao, formaPagamentoId)

        try {
            if(!uuid) {
                throw new AppError(
                    "ID é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }

            if(typeof uuid !== 'string') {
                throw new AppError(
                    "ID deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }

            if(!lat || !long) {
                throw new AppError(
                    "Coordenadas é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "COORDENADAS_BAD_REQUEST"
                )
            }

            if(!precisao) {
                throw new AppError(
                    "Precisao é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "PRECISA_GPS_BAD_REQUEST"
                )
            }

            if(typeof precisao !== 'float') {
                "Precisão é obrigatório serem tipo float",
                HTTP_STATUS_CODES.BAD_REQUEST,
                "PRECISAO_GPS_BAD_REQUEST"
            }

            const opcoesStatus = ['entregue', 'cancelado'];

            if (!opcoesStatus.includes(status)) {
                throw new AppError(
                    "Status inválido, opções de entregue e cancelado apenas",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "STATUS_NOT_FOUND"
                )
            }

            if(formaPagamentoId && isNaN(Number(formaPagamentoId)) ) {
                throw new AppError(
                    "Forma de pagamento deve ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FORMA_PAGAMENTO_NOT_FOUND"
                )
            }

            const servico = new finalizarPedidoDeliveryServico()
            const resultado = await servico.executar(uuid, status, lat, long, precisao, formaPagamentoId);

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { finalizarPedidoDeliveryControlador }
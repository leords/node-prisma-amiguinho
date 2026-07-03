import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { carregarPedidoDeliveryServico } from "../../servico/pedido/carregarPedidoDeliveryServico.js"

class carregarPedidoDeliveryControlador {
    async tratar(req, res, next) {

        const uuid = req.params.uuid

        console.log('UUID: ', uuid)

        try {
            if(!uuid && isNaN(Number(uuid))) {
                throw new AppError(
                    "ID é obrigatório e deve ser do tipo numero",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAR_REQUEST"
                )
            }

            const servico = new carregarPedidoDeliveryServico()
            const resultado = await servico.executar(uuid);

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { carregarPedidoDeliveryControlador }
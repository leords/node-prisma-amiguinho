import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes"
import { AppError } from "../../error/appError"
import { validarEntregaDeliveryServico } from "../../servico/pedido/validarEntregaDeliveryServico"

class validarEntregaDeliveryControlador {
    async tratar(req, res, next) {

        const { id } = req.params
        const { status, latitudeEntrega, longitudeEntrega, precisaoGps } = req.body

        try {
            if(!id || isNaN(id)) {
                throw new AppError(
                    "ID é obrigatório e deve ser do tipo numero",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "ID_NOT_FOUND"
                )
            }

            if(!status || typeof status !== 'string' ) {
                throw new AppError(
                    "Status é obrigatório",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "STATUS_NOT_FOUND"
                )
            }

            // Valida o status estar dentro das opções.
            const statusValidos = ['PENDENTE', 'CARREGADO', 'ENTREGUE', 'CANCELADO'];
            if (!statusValidos.includes(status)) {
                throw new AppError(
                    "Status não é válido",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "STATUS_NOT_VALID"
                );
            }


            if(
                (latitudeEntrega && isNaN(Number(latitudeEntrega))) || 
                (longitudeEntrega && isNaN(Number(longitudeEntrega)))
            ) {
                throw new AppError(
                    "Coordenadas devem ser numéricas",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "COORDENADAS_INVALID"
                )
            }

            if(precisaoGps && isNaN(precisaoGps)) {
                throw new AppError(
                    "Precisão deve ser numérica",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "STATUS_NOT_FOUND"
                )
            }

            const pedidoId = Number(id)

            const servico = new validarEntregaDeliveryServico();
            const resultado = await servico.executar(pedidoId, status, latitudeEntrega, longitudeEntrega, precisaoGps);
            
            
            return res.status(HTTP_STATUS_CODES.OK).json(resultado)

        } catch (error) {
            console.log(error)
            next(error)
        }

    }
}

export { validarEntregaDeliveryControlador }
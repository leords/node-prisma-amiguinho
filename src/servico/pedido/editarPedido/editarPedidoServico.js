import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js"
import { AppError } from "../../../error/appError.js"
import { EditarPedidoBalcao } from "./editarPedidoBalcao.js"
import { EditarPedidoDelivery } from "./editarPedidoDelivery.js"
import { EditarPedidoExterno } from "./editarPedidoExterno.js"

class EditarPedidoServico {
    async executar(setor, uuid, formaPagamentoId, dados) {

        // criando um objeto com as classes, 
        const servicos = {
            balcao: new EditarPedidoBalcao(),
            delivery: new EditarPedidoDelivery(),
            externo: new EditarPedidoExterno()
        }

        const servico = servicos[setor]


        if(!servico) {
            throw new AppError(
                "Não foi possivel encontrar o setor",
                HTTP_STATUS_CODES.NOT_FOUND,
                "SETOR_NOT_FOUND"
            )
        }

        //chamando a função
        return await servico.executar(uuid, formaPagamentoId, dados)
    }
}

export { EditarPedidoServico }
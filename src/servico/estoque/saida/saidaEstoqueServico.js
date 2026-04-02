import { SaidaEstoqueBalcao } from "./saidaEstoqueBalcao.js"
import { SaidaEstoqueDelivery } from "./saidaEstoqueDelivery.js"
import { SaidaEstoqueExterno } from "./saidaEstoqueExterno.js"
import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js"
import { AppError } from "../../../error/appError.js"

class SaidaEstoqueServico {
    async executar(pedidoId, setor, prisma) {

        // array de funções
        const servicos = {
            balcao: new SaidaEstoqueBalcao(),
            externo: new SaidaEstoqueExterno(),
            delivery: new SaidaEstoqueDelivery(),
        }

        // chamando a função pelo setor
        const servico = servicos[setor]


        if(!servico) {
            throw new AppError(
                "Não foi possivel encontrar o setor",
                HTTP_STATUS_CODES.NOT_FOUND,
                "SETOR_NOT_FOUND"
            )
        }

        //chamando a função
        return await servico.executar(pedidoId, prisma)
    }


}

export { SaidaEstoqueServico }


import { DeletarMovimentacaoServico } from "../../servico/movimentacaoManual/deletarMovimentacaoServico.js"
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"

class DeletarMovimentacaoControlador {
    async tratar(req, res, next) {
        const id = Number(req.params.id)

        try {
            if(!id) {
                throw new Error('Fechamento ID é obrigatório')
            }

            if(isNaN(id)) {
                throw new Error('Fechamento ID deve ser um número')
            }

            const resultado = new DeletarMovimentacaoServico();
            const servico = await resultado.executar(id);

            return res.status(HTTP_STATUS_CODES.OK).json(servico)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { DeletarMovimentacaoControlador }   
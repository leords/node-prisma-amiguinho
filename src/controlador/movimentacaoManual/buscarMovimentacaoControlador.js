import { BuscarMovimentacaoServico } from '../../servico/movimentacaoManual/buscarMovimentacaoServico.js'
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class BuscarMovimentacaoControlador {
    async tratar(req, res) {

        const fechamentoId = Number(req.params.fechamentoId);

        try {
            if(!fechamentoId) {
                throw new Error('Fechamento ID é obrigatório')
            }
            if(isNaN(fechamentoId)) {
                throw new Error('Fechamento ID deve ser um número')
            }

            const resultado = new BuscarMovimentacaoServico();
            const servico = await resultado.executar(fechamentoId);

            return res.status(HTTP_STATUS_CODES.OK).json(servico)

        } catch (error) {
            const { status, mensagem } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }
    }
}


export { BuscarMovimentacaoControlador }
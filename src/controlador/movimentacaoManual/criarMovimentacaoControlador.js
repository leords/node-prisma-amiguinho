import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { CriarMovimentacaoServico } from "../../servico/movimentacaoManual/criarMovimentacaoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class CriarMovimentacaoControlador {
    async tratar(req, res) {
        const { fechamentoId, tipo, descricao, valor } = req.body

        try {

            if(!fechamentoId) {
                throw new Error('Fechamento ID é obrigatório')
            }
            if(isNaN(fechamentoId)) {
                throw new Error('Fechamento ID deve ser um número')
            }

            if(!tipo) {
                throw new Error('Tipo é obrigatório')
            }
            const opcoesTipo = ['entrada', 'saida']
            if(!opcoesTipo.includes(tipo)) {
                throw new Error('Tipo deve ser entrada ou saida')
            }

            if(!descricao) {
                throw new Error('Descrição é obrigatória')
            }
            if(typeof descricao !== 'string') {
                throw new Error('Descrição deve ser uma string')
            }

            if(!valor) {
                throw new Error('Valor é obrigatório')
            }
            if(isNaN(valor)) {
                throw new Error('Valor deve ser um número')
            }

            const resultado = new CriarMovimentacaoServico();
            const servico = await resultado.executar(fechamentoId, tipo, descricao, valor);

            return res.status(HTTP_STATUS_CODES.CREATED).json(servico)

        } catch (error) {
            console.log(error)
            const { status, mensagem } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }
    }
}


export { CriarMovimentacaoControlador }
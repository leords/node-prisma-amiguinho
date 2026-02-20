import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { CriarFechamentoServico } from "../../servico/fechamento/criarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"


class CriarFechamentoControlador {
    async tratar(req, res) {
        const { setor } = req.params
        const {vendedor} = req.body

        try {
            if(!setor) {
                throw new Error('Setor é obrigatório')
            }

            if(typeof setor !== 'string') {
                throw new Error('Setor deve ser texto')
            }
            const opcoesSetor = ['delivery', 'externo', 'balcao']
            if(!opcoesSetor.includes(setor)) {
                throw new Error('Setor inválido')
            }

            if(!vendedor) { 
                throw new Error('Vendedor é obrigatório')
            }
            if(typeof vendedor !== 'string') {
                throw new Error('Vendedor deve ser texto')
            }

            const servico = new CriarFechamentoServico()
            const resultado = await servico.executar(setor, vendedor)

            return res.status(HTTP_STATUS_CODES.CREATED).json(resultado)
        } catch (error) {
            console.log(error)
            const { mensagem, status } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }
    }
}

export { CriarFechamentoControlador }
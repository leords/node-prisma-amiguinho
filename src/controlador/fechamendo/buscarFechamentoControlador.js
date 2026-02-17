import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { BuscarFechamentoServico } from "../../servico/fechamento/buscarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class BuscarFechamentoControlador { 
    async tratar(req, res) {

        const { setor } = req.params
        const vendedor = req.query.vendedor ? req.query.vendedor : undefined
        const data = req.query.data ? req.query.data : undefined

        try {
            if(vendedor && typeof vendedor !== 'string') {
                throw new Error('Vendedor deve ser texto')
            }
            
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
            
            if(data && typeof data !== 'string') {
                throw new Error('Data deve ser texto')
            }

            const dataInicio = data ? new Date(`${data}T00:00:00-03:00`) : undefined
            const dataFim = data ? new Date(`${data}T23:59:59.999-03:00`) : undefined

            const resultado = new BuscarFechamentoServico();
            const servico = await resultado.executar(vendedor, setor, dataInicio, dataFim);

            return res.status(HTTP_STATUS_CODES.OK).json(servico)

        } catch (error) {
            console.log(error)
            const { mensagem, status } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }   
    }
}

export { BuscarFechamentoControlador }
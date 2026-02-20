import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { EditarFechamentoServico } from "../../servico/fechamento/editarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class EditarFechamentoControlador {
    async tratar(req, res) {
        const  id  = Number(req.params.id)
        const { status } = req.body

        try {
            if(!id) {
                throw new Error('Id é obrigatório')
            }
            if(isNaN(id)) {
                throw new Error('Id deve ser um número')
            }
            if(!status) {
                throw new Error('Status é obrigatório')
            }
            const opcoesStatus = ['aberto', 'fechado', 'cancelado']
            if(!opcoesStatus.includes(status)) {
                throw new Error('Status inválido')
            }

            const resultado = new EditarFechamentoServico()
            const servico = await resultado.executar(id, status)

            return res.status(HTTP_STATUS_CODES.OK).json(servico)

        } catch (error) {
            console.log(error)
            const { mensagem, status } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }
    }
}

export { EditarFechamentoControlador }

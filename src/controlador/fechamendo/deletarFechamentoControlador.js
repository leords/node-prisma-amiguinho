import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { DeletarFechamentoServico } from "../../servico/fechamento/deletarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class DeletarFechamentoControlador {
    async tratar(req, res) {
        const id = Number(req.params.id)

        try {
            if(!id) {
                throw new Error('Id é obrigatório')
            }
            if(isNaN(id)) {
                throw new Error('Id deve ser um número')
            }

            const servico = new DeletarFechamentoServico()
            const resultado = await servico.executar(id)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
        } catch (error) {
            console.log(error)
            const { mensagem, status } = coletarErro(error)
            return res.status(status).json({ mensagem })
        }
    }
}

export { DeletarFechamentoControlador }
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { EditarPedidoServico } from "../../servico/pedido/editarPedido/editarPedidoServico.js"

class EditarPedidoControlador {
 async tratar(req, res, next) {

    try {
        const { setor, uuid } = req.params
        const formaPagamentoId = req.query.formaPagamentoId ? Number(req.query.formaPagamentoId) : undefined
        const dados = req.body


        if(!setor) {
            throw new Error('Setor é obrigatório')
        }
        const opcaoSetor = ['delivery', 'externo', 'balcao']
        if (!opcaoSetor.includes(setor)) {
            throw new Error('Setor inválido')
        }
        if(uuid && typeof uuid !== 'string') {
            throw new Error('UUID é obrigatório')
        }
        if(formaPagamentoId && isNaN(formaPagamentoId)) {
            throw new Error('Forma de pagamento precisa ser um número')
        }
        if(dados && typeof dados.length === 0) {
            throw new Error('Dados é obrigatório')
        }

        const servico = new EditarPedidoServico()
        const resultado = await servico.executar(setor, uuid, formaPagamentoId, dados);
        return res.status(HTTP_STATUS_CODES.OK).json({
            resultado: resultado,
            mensagem: 'Pedido editado com sucesso'
        })

    } catch (error) {
         console.log(error)
         next(error)
    }
 }
}

export { EditarPedidoControlador }
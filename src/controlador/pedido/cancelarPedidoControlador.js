import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { CancelarPedidoServico } from '../../servico/pedido/cancelarPedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class CancelarPedidoControlador {
  async tratar(req, res) {
    const { setor } = req.params
    const id = Number(req.params.id)
    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      if (!setor) {
        throw new Error('Setor é obrigatório')
      }
      if (!opcoesSetor.includes(setor)) {
        throw new Error(
          'Setor inválido, opções válidas: delivery, externo e balcao'
        )
      }

      if (!id) {
        throw new Error('ID é obrigatório')
      }

      if (isNaN(id)) {
        throw new Error('ID deve ser um número')
      }

      const servico = new CancelarPedidoServico()
      const resultado = await servico.executar(id, setor)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { mensagem, status } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { CancelarPedidoControlador }

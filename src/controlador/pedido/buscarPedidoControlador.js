import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { BuscarPedidoServico } from '../../servico/pedido/buscarPedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarPedidoControlador {
  async tratar(req, res) {
    const setor = req.query.setor ? req.query.setor : undefined
    const vendedor = req.query.vendedor ? Number(req.query.vendedor) : undefined
    const cliente = req.query.cliente ? Number(req.query.cliente) : undefined
    const formaPagamentoId = req.query.formaPagamento
      ? Number(req.query.formaPagamento)
      : undefined
    // Mantenho as datas vindos como strings, vem no formato 2025-12-14
    const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
    const dataFim = req.query.dataFim ? req.query.dataFim : undefined
    const usuarioId = req.query.usuarioId
      ? Number(req.query.usuarioId)
      : undefined

    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']
      const opcoesVendedor = ['b1', 'b2', 'b3']

      if (setor && typeof setor !== 'string' && !opcoesSetor.includes(setor)) {
        throw new Error(ERRO_MSG_PEDIDOS.SETOR)
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new Error('Vendedor inválido')
      }
      if (setor === 'balcao' && vendedor) {
        if (!opcoesVendedor.includes(vendedor)) {
          throw new Error(ERRO_MSG_PEDIDOS.VENDEDOR_BALCAO)
        }
      }
      if (cliente && typeof cliente !== 'string') {
        throw new Error('Cliente inválido')
      }
      if (formaPagamentoId && isNaN(formaPagamentoId)) {
        throw new Error('Forma de pagamento inválida')
      }
      if (usuarioId && isNaN(usuarioId)) {
        throw new Error('ID de usuário inválido')
      }

      // valido a tipagem das datas.
      if (
        dataInicio &&
        typeof dataInicio !== 'string' &&
        dataFim &&
        typeof dataFim !== 'string'
      ) {
        throw new Error('Data inválida')
      }

      // transformo elas em ISO manualmente. desta forma consigo pegar o intervalor do dia inteiro.
      const inicio = new Date(`${dataInicio}T00:00:00-03:00`)
      const fim = new Date(`${dataFim}T23:59:59.999-03:00`)

      const servico = new BuscarPedidoServico()
      const resultado = await servico.executar(
        setor,
        vendedor,
        cliente,
        formaPagamentoId,
        inicio,
        fim,
        usuarioId
      )

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { BuscarPedidoControlador }

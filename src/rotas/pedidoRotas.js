import { Router } from 'express'
import { CriarPedidoControlador } from '../controlador/pedido/criarPedidoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { BuscarPedidoControlador } from '../controlador/pedido/buscarPedidoControlador.js'
import { BuscarFechamentoBalcaoDiaControlador } from '../controlador/pedido/buscarFechamentoBalcaoDiaControlador.js'
import { TicketMedioControlador } from '../controlador/pedido/ticketMedioControlador.js'
import { TopProdutoControlador } from '../controlador/pedido/topProdutoControlador.js'
import { LinhaTemporalControlador } from '../controlador/pedido/linhaTemporalControlador.js'

const rotas = Router()

rotas.post(
  '/novo-pedido/:setor',
  autenticadorMiddleware,
  new CriarPedidoControlador().tratar
)

rotas.get(
  '/buscar-pedidos',
  autenticadorMiddleware,
  new BuscarPedidoControlador().tratar
)

rotas.get(
  '/buscar-fechamento-balcao-dia',
  autenticadorMiddleware,
  new BuscarFechamentoBalcaoDiaControlador().tratar
)

rotas.get(
  '/ticket-medio/:setor',
  autenticadorMiddleware,
  new TicketMedioControlador().tratar
)

rotas.get(
  '/top-produtos/:setor',
  //autenticadorMiddleware,
  new TopProdutoControlador().tratar
)

rotas.get(
  '/intervalo-temporal/:setor',
  //autenticadorMiddleware,
  new LinhaTemporalControlador().tratar
)

export { rotas as pedidoRotas }

import { Router } from 'express'
import { CriarPedidoControlador } from '../controlador/pedido/criarPedidoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { BuscarPedidoControlador } from '../controlador/pedido/buscarPedidoControlador.js'
import { BuscarFechamentoBalcaoDiaControlador } from '../controlador/pedido/buscarFechamentoBalcaoDiaControlador.js'

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

export { rotas as pedidoRotas }

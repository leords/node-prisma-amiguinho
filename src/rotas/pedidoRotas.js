import { Router } from 'express'
import { CriarPedidoControlador } from '../controlador/pedido/criarPedidoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/novo-pedido/:setor',
  autenticadorMiddleware,
  new CriarPedidoControlador().tratar
)

export { rotas as pedidoRotas }

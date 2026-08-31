import { Router } from 'express'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { buscarEntregadorControlador } from '../controlador/entregador/buscarEntregadorControlador.js'

const rotas = Router()

rotas.post(
  '/solicitar-localizacao',
  autenticadorMiddleware,
  new buscarEntregadorControlador().tratar
)

export { rotas as socketRotas }

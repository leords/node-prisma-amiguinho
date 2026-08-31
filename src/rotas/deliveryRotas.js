import { Router } from 'express'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { estatisticasEntregaControlador } from '../controlador/entregaDelivery/estatisticasEntregaControlador.js'

const rotas = Router()

rotas.get(
  '/tempo-medio-entregas',
  autenticadorMiddleware,
  new estatisticasEntregaControlador().tratar
)

export { rotas as deliveryRotas }

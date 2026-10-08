import { Router } from 'express'
import { ObterMetricasDescontoControlador } from '../controlador/desconto/obterMetricasDescontoControlador.js'
import { ListarPedidosComDescontoControlador } from '../controlador/desconto/listarPedidosComDescontoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

// Rota de métricas consolidadas do produto DESCONTO
rotas.get(
  '/descontos/metricas',
  autenticadorMiddleware,
  new ObterMetricasDescontoControlador().tratar
)

// Rota de listagem de pedidos com DESCONTO aplicado (com filtros de período, vendedor, cliente e setor)
rotas.get(
  '/descontos/pedidos',
  autenticadorMiddleware,
  new ListarPedidosComDescontoControlador().tratar
)

rotas.get(
  '/descontos',
  autenticadorMiddleware,
  new ListarPedidosComDescontoControlador().tratar
)

export { rotas as descontoRotas }

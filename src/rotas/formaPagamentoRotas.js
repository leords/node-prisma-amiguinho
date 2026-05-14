import { Router } from 'express'
import { BuscarFormaPagamentControlador } from '../controlador/formaPagamento/buscarFormaPagamentoControlador.js'
import { LerFormaPagamentoControlador } from '../controlador/formaPagamento/lerFormaPagamentoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.get(
  '/buscar-formas-pagamento',
  autenticadorMiddleware,
  new BuscarFormaPagamentControlador().tratar
)
rotas.get('/ler-formas-pagamento', 
  autenticadorMiddleware,
  new LerFormaPagamentoControlador().tratar)

export { rotas as formaPagamentoRotas }

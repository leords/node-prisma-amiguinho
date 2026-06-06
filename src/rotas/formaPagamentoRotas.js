import { Router } from 'express'
import { BuscarFormaPagamentControlador } from '../controlador/formaPagamento/buscarFormaPagamentoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { LerFormaPagamentoBalcaoControlador } from '../controlador/formaPagamento/lerFormaPagamentoBalcaoControlador.js'
import { LerFormaPagamentoExternaControlador } from '../controlador/formaPagamento/lerFormaPagamentoExternaControlador.js'

const rotas = Router()

rotas.get(
  '/buscar-formas-pagamento',
  autenticadorMiddleware,
  new BuscarFormaPagamentControlador().tratar
)
rotas.get('/ler-formas-pagamento-balcao', 
  autenticadorMiddleware,
  new LerFormaPagamentoBalcaoControlador().tratar)

  rotas.get('/ler-formas-pagamento-externa', 
  autenticadorMiddleware,
  new LerFormaPagamentoExternaControlador().tratar)

export { rotas as formaPagamentoRotas }

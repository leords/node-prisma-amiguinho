import { Router } from 'express'
import { BuscarFormaPagamentControlador } from '../controlador/formaPagamento/buscarFormaPagamentoControlador.js'
import { LerFormaPagamentoControlador } from '../controlador/formaPagamento/lerFormaPagamentoControlador.js'

const rotas = Router()

rotas.get(
  '/buscar-formas-pagamento',
  new BuscarFormaPagamentControlador().tratar
)
rotas.get('/ler-formas-pagamento', new LerFormaPagamentoControlador().tratar)

export { rotas as formaPagamentoRotas }

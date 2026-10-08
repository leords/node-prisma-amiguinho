import { Router } from 'express'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { criarLocalizacaoPedidoControlador } from '../controlador/localizacao/criarLocalizacaoPedidoControlador.js'
import { buscarLocalizacaoPedidosControlador } from '../controlador/localizacao/buscarLocalizacaoPedidosControlador.js'
import { BuscarRotaVendedorControlador } from '../controlador/localizacao/buscarRotaVendedorControlador.js'

const rotas = Router()

rotas.post(
  '/criar-localizacao-pedido',
  autenticadorMiddleware,
  new criarLocalizacaoPedidoControlador().tratar
)

rotas.get(
  '/buscar-localizacao-pedido',
  autenticadorMiddleware,
  new buscarLocalizacaoPedidosControlador().tratar
)

rotas.get(
  '/localizacoes/vendedor',
  autenticadorMiddleware,
  new BuscarRotaVendedorControlador().tratar
)

rotas.get(
  '/localizacao/vendedor',
  autenticadorMiddleware,
  new BuscarRotaVendedorControlador().tratar
)

export { rotas as localizacaoRotas }

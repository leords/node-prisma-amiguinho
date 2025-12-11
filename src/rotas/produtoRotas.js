import { Router } from 'express'
import { BuscarProdutosAPIControlador } from '../controlador/produtos/buscarProdutosAPIControlador.js'
import { LerProdutosControlador } from '../controlador/produtos/lerProdutosControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.get(
  '/buscar-produtos',
  autenticadorMiddleware,
  new BuscarProdutosAPIControlador().tratar
)
rotas.get(
  '/ler-produtos',
  autenticadorMiddleware,
  new LerProdutosControlador().tratar
)

export { rotas as produtosRotas }

import { Router } from 'express'
import { BuscarClienteExternoControlador } from '../controlador/clienteExterno/buscarClienteExternoControlador.js'
import { LerClienteExternoControlador } from '../controlador/clienteExterno/lerClienteExternoControlador.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/coletar-clientes-externo',
  new BuscarClienteExternoControlador().tratar
)
rotas.get(
  '/ler-clientes-externo',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1, 2]),
  new LerClienteExternoControlador().tratar
)

export { rotas as clienteExternoRotas }

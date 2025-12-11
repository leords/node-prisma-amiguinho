import { Router } from 'express'
import { BuscarCLienteDeliveryControlador } from '../controlador/clienteDelivery/buscarClienteDeliveryControlador.js'
import { LerClienteDeliveryControlador } from '../controlador/clienteDelivery/lerClienteDeliveryControlador.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/coletar-clientes-delivery',
  new BuscarCLienteDeliveryControlador().tratar
)
rotas.get(
  '/ler-clientes-delivery',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1, 3]),
  new LerClienteDeliveryControlador().tratar
)

export { rotas as clienteDeliveryRotas }

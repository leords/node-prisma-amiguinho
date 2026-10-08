import { Router } from 'express'
import { CriarPendenciaControlador } from '../controlador/pendencia/criarPendenciaControlador.js'
import { ListarPendenciaControlador } from '../controlador/pendencia/listarPendenciaControlador.js'
import { BuscarPendenciaPorIdControlador } from '../controlador/pendencia/buscarPendenciaPorIdControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/pendencias',
  autenticadorMiddleware,
  new CriarPendenciaControlador().tratar
)

rotas.get(
  '/pendencias',
  autenticadorMiddleware,
  new ListarPendenciaControlador().tratar
)

rotas.get(
  '/pendencias/:id',
  autenticadorMiddleware,
  new BuscarPendenciaPorIdControlador().tratar
)

export { rotas as pendenciaRotas }

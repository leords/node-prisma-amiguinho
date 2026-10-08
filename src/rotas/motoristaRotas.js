import { Router } from 'express'
import { CriarMotoristaControlador } from '../controlador/motorista/criarMotoristaControlador.js'
import { EditarMotoristaControlador } from '../controlador/motorista/editarMotoristaControlador.js'
import { ListarMotoristaControlador } from '../controlador/motorista/listarMotoristaControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/motoristas',
  autenticadorMiddleware,
  new CriarMotoristaControlador().tratar
)

rotas.put(
  '/motoristas/:id',
  autenticadorMiddleware,
  new EditarMotoristaControlador().tratar
)

rotas.get(
  '/motoristas',
  autenticadorMiddleware,
  new ListarMotoristaControlador().tratar
)

export { rotas as motoristaRotas }

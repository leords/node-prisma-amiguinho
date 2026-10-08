import { Router } from 'express'
import { CriarVeiculoControlador } from '../controlador/veiculo/criarVeiculoControlador.js'
import { EditarVeiculoControlador } from '../controlador/veiculo/editarVeiculoControlador.js'
import { ListarVeiculoControlador } from '../controlador/veiculo/listarVeiculoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/veiculos',
  autenticadorMiddleware,
  new CriarVeiculoControlador().tratar
)

rotas.put(
  '/veiculos/:id',
  autenticadorMiddleware,
  new EditarVeiculoControlador().tratar
)

rotas.get(
  '/veiculos',
  autenticadorMiddleware,
  new ListarVeiculoControlador().tratar
)

export { rotas as veiculoRotas }

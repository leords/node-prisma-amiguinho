import { Router } from 'express'
import { CriarCargaControlador } from '../controlador/carga/criarCargaControlador.js'
import { FinalizarCargaControlador } from '../controlador/carga/finalizarCargaControlador.js'
import { ListarCargaControlador } from '../controlador/carga/listarCargaControlador.js'
import { RemoverPedidoCargaControlador } from '../controlador/carga/removerPedidoCargaControlador.js'
import { AdicionarPedidosCargaControlador } from '../controlador/carga/adicionarPedidosCargaControlador.js'
import { CancelarCargaControlador } from '../controlador/carga/cancelarCargaControlador.js'
import { RetornarCargaPendenteControlador } from '../controlador/carga/retornarCargaPendenteControlador.js'
import { ConcluirCargaControlador } from '../controlador/carga/concluirCargaControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/cargas',
  autenticadorMiddleware,
  new CriarCargaControlador().tratar
)

rotas.patch(
  '/cargas/:id/finalizar',
  autenticadorMiddleware,
  new FinalizarCargaControlador().tratar
)

rotas.patch(
  '/cargas/:id/retornar-pendente',
  autenticadorMiddleware,
  new RetornarCargaPendenteControlador().tratar
)

rotas.patch(
  '/cargas/:id/concluir',
  autenticadorMiddleware,
  new ConcluirCargaControlador().tratar
)

rotas.get(
  '/cargas',
  autenticadorMiddleware,
  new ListarCargaControlador().tratar
)

rotas.delete(
  '/cargas/:cargaId/pedidos/:pedidoId',
  autenticadorMiddleware,
  new RemoverPedidoCargaControlador().tratar
)

rotas.post(
  '/cargas/:cargaId/pedidos',
  autenticadorMiddleware,
  new AdicionarPedidosCargaControlador().tratar
)

rotas.delete(
  '/cargas/:id',
  autenticadorMiddleware,
  new CancelarCargaControlador().tratar
)

export { rotas as cargaRotas }


import { Router } from 'express'
import { CriarPagamentoControlador } from '../controlador/pagamento/criarPagamentoControlador.js'
import { EditarPagamentoControlador } from '../controlador/pagamento/editarPagamentoControlador.js'
import { ListarPagamentoControlador } from '../controlador/pagamento/listarPagamentoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/pagamentos',
  autenticadorMiddleware,
  new CriarPagamentoControlador().tratar
)

rotas.put(
  '/pagamentos/:id',
  autenticadorMiddleware,
  new EditarPagamentoControlador().tratar
)

rotas.get(
  '/pagamentos',
  autenticadorMiddleware,
  new ListarPagamentoControlador().tratar
)

export { rotas as pagamentoRotas }

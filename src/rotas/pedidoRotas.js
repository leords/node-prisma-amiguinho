import { Router } from 'express'
import { CriarPedidoControlador } from '../controlador/pedido/criarPedidoControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { BuscarPedidoControlador } from '../controlador/pedido/buscarPedidoControlador.js'
import { BuscarFechamentoBalcaoDiaControlador } from '../controlador/pedido/buscarFechamentoBalcaoDiaControlador.js'
import { TicketMedioControlador } from '../controlador/pedido/ticketMedioControlador.js'
import { TopProdutoControlador } from '../controlador/pedido/topProdutoControlador.js'
import { LinhaTemporalControlador } from '../controlador/pedido/linhaTemporalControlador.js'
import { CancelarPedidoControlador } from '../controlador/pedido/cancelarPedidoControlador.js'
import { QuantidadePedidoControlador } from '../controlador/pedido/quantidadePedidoControlador.js'
import { TotalVendasPeriodoControlador } from '../controlador/pedido/totalVendasPeriodoControlador.js'
import { TotalPorFormaPagamentoControlador } from '../controlador/pedido/totalPorFormaPagamentoControlador.js'
import { RelatorioMixProdutosControlador } from '../controlador/pedido/relatorioMixProdutosControlador.js'

const rotas = Router()

rotas.post(
  '/novo-pedido/:setor',
  //autenticadorMiddleware,
  new CriarPedidoControlador().tratar
)

rotas.get(
  '/buscar-pedidos',
  //autenticadorMiddleware,
  new BuscarPedidoControlador().tratar
)

rotas.get(
  '/buscar-fechamento-balcao-dia',
  //autenticadorMiddleware,
  new BuscarFechamentoBalcaoDiaControlador().tratar
)

rotas.get(
  '/ticket-medio/:setor',
  //autenticadorMiddleware,
  new TicketMedioControlador().tratar
)

rotas.get(
  '/top-produtos/:setor',
  //autenticadorMiddleware,
  new TopProdutoControlador().tratar
)

rotas.get(
  '/intervalo-temporal/:setor',
  //autenticadorMiddleware,
  new LinhaTemporalControlador().tratar
)

rotas.patch(
  '/cancelar-pedido/:setor/:id',
  //autenticadorMiddleware,
  new CancelarPedidoControlador().tratar
)

rotas.get(
  '/quantidade-pedidos/:setor',
  //autenticadorMiddleware,
  new QuantidadePedidoControlador().tratar
)

rotas.get(
  '/total-vendas-periodo/:setor',
  //autenticadorMiddleware,
  new TotalVendasPeriodoControlador().tratar
)

rotas.get(
  '/total-por-forma-pagamento/:setor',
  //autenticadorMiddleware,
  new TotalPorFormaPagamentoControlador().tratar
)

rotas.get(
  '/relatorio-mix-produtos/:setor',
  //autenticadorMiddleware,
  new RelatorioMixProdutosControlador().tratar
)

export { rotas as pedidoRotas }

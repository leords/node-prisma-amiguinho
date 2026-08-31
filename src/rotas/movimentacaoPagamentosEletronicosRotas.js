import { Router } from 'express'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'
import { CriarMovimentacaoPagamentosEletronicosControlador } from '../controlador/movimentacaoPagamentosEletronicos/criarMovimentacaoPagamentosEletronicosControlador.js'
import { SomarMovimentacaoPagamentosEletronicosControlador } from '../controlador/movimentacaoPagamentosEletronicos/somarMovimentacaoPagamentosEletronicosControlador.js'
import { BuscarMovimentacaoPagamentosEletronicosControlador } from '../controlador/movimentacaoPagamentosEletronicos/buscarMovimentacaoPagamentosEletronicosControlador.js'
import { DeletarMovimentacaoPagamentosEletronicosControlador } from '../controlador/movimentacaoPagamentosEletronicos/deletarMovimentacaoPagamentosEletronicosControlador.js'

const rotas = Router()

rotas.post(
  '/criar-movimentacao-pagamento-eletronico',
  autenticadorMiddleware,
  nivelAcessoMiddleware(['ADMIN']),
  new CriarMovimentacaoPagamentosEletronicosControlador().tratar
)

rotas.get(
  '/somar-movimentacao-pagamento-eletronico/:fechamentoId',
  autenticadorMiddleware,
  new SomarMovimentacaoPagamentosEletronicosControlador().tratar
)

rotas.get(
  '/buscar-movimentacao-pagamento-eletronico/:fechamentoId',
  autenticadorMiddleware,
  new BuscarMovimentacaoPagamentosEletronicosControlador().tratar
)

rotas.delete(
  '/deletar-movimentacao-pagamento-eletronico/:id',
  autenticadorMiddleware,
  new DeletarMovimentacaoPagamentosEletronicosControlador().tratar
)

export { rotas as movimentacaopagamentosEletronicosRotas }

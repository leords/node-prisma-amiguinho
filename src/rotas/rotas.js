import { Router } from 'express'
import { clienteDeliveryRotas } from './clienteDeliveryRotas.js'
import { clienteExternoRotas } from './clienteExternoRotas.js'
import { produtosRotas } from './produtoRotas.js'
import { formaPagamentoRotas } from './formaPagamentoRotas.js'
import { pedidoRotas } from './pedidoRotas.js'
import { usuarioRotas } from './usuarioRotas.js'
import { nivelAcessoRotas } from './nivelAcessoRota.js'
import { fechamentoRotas } from './fechamentoRotas.js'
import { movimentacaoRotas } from './movimentacaoRotas.js'

const rotas = Router()

rotas.use(clienteDeliveryRotas)
rotas.use(clienteExternoRotas)
rotas.use(produtosRotas)
rotas.use(formaPagamentoRotas)
rotas.use(pedidoRotas)
rotas.use(usuarioRotas)
rotas.use(nivelAcessoRotas)
rotas.use(fechamentoRotas)
rotas.use(movimentacaoRotas)


export { rotas }

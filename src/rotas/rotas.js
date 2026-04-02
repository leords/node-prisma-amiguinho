import { Router } from 'express'
import { clienteDeliveryRotas } from './clienteDeliveryRotas.js'
import { clienteExternoRotas } from './clienteExternoRotas.js'
import { produtosRotas } from './produtoRotas.js'
import { formaPagamentoRotas } from './formaPagamentoRotas.js'
import { pedidoRotas } from './pedidoRotas.js'
import { usuarioRotas } from './usuarioRotas.js'
import { fechamentoRotas } from './fechamentoRotas.js'
import { movimentacaoRotas } from './movimentacaoRotas.js'
import { onlineRotas } from './online.js'
import { estoque } from './estoqueRotas.js'
import { fornecedorRotas } from './fornecedorRotas.js'


const rotas = Router()

rotas.use(clienteDeliveryRotas)
rotas.use(clienteExternoRotas)
rotas.use(produtosRotas)
rotas.use(formaPagamentoRotas)
rotas.use(pedidoRotas)
rotas.use(usuarioRotas)
rotas.use(fechamentoRotas)
rotas.use(movimentacaoRotas)
rotas.use(onlineRotas)
rotas.use(estoque)
rotas.use(fornecedorRotas)




export { rotas }

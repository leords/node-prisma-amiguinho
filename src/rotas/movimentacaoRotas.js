import { Router } from "express";
import { CriarMovimentacaoControlador } from "../controlador/movimentacaoManual/criarMovimentacaoControlador.js";
import { SomarMovimentacaoControlador } from "../controlador/movimentacaoManual/somarMovimentacaoControlador.js";
import { BuscarMovimentacaoControlador } from "../controlador/movimentacaoManual/buscarMovimentacaoControlador.js";
import { DeletarMovimentacaoControlador } from "../controlador/movimentacaoManual/deletarMovimentacaoControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'


const rotas = Router()

rotas.post('/criar-movimentacao', 
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new CriarMovimentacaoControlador().tratar )

rotas.get('/somar-movimentacao/:fechamentoId', 
    autenticadorMiddleware,
    new SomarMovimentacaoControlador().tratar )

rotas.get('/buscar-movimentacao/:fechamentoId', 
    autenticadorMiddleware,
    new BuscarMovimentacaoControlador().tratar )

rotas.delete('/deletar-movimentacao/:id', 
    autenticadorMiddleware,
    new DeletarMovimentacaoControlador().tratar )




export { rotas as movimentacaoRotas }
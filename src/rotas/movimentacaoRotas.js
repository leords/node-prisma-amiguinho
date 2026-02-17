import { Router } from "express";
import { CriarMovimentacaoControlador } from "../controlador/movimentacaoManual/criarMovimentacaoControlador.js";
import { SomarMovimentacaoControlador } from "../controlador/movimentacaoManual/somarMovimentacaoControlador.js";
import { BuscarMovimentacaoControlador } from "../controlador/movimentacaoManual/buscarMovimentacaoControlador.js";


const rotas = Router()

rotas.post('/criar-movimentacao', new CriarMovimentacaoControlador().tratar )
rotas.get('/somar-movimentacao/:fechamentoId', new SomarMovimentacaoControlador().tratar )
rotas.get('/buscar-movimentacao/:fechamentoId', new BuscarMovimentacaoControlador().tratar )



export { rotas as movimentacaoRotas }
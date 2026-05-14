import { Router } from "express";
import { BuscarEstoqueControlador } from "../controlador/estoque/buscarEstoqueControlador.js";
import { AjusteEstoqueControlador } from "../controlador/estoque/ajusteEstoqueControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'


const rotas = Router();


rotas.get(
  '/buscar-estoque',
  autenticadorMiddleware,
  new BuscarEstoqueControlador().tratar
)

rotas.post(
  '/ajuste-estoque/:produtoId',
  autenticadorMiddleware,
  nivelAcessoMiddleware(['ADMIN']),
  new AjusteEstoqueControlador().tratar
)

export { rotas as estoque }
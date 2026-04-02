import { Router } from "express";
import { BuscarEstoqueControlador } from "../controlador/estoque/buscarEstoqueControlador.js";
import { AjusteEstoqueControlador } from "../controlador/estoque/ajusteEstoqueControlador.js";


const rotas = Router();


rotas.get(
  '/buscar-estoque',
  //autenticadorMiddleware,
  //nivelAcessoMiddleware([1, 3]),
  new BuscarEstoqueControlador().tratar
)

rotas.post(
  '/ajuste-estoque/:produtoId',
  //autenticadorMiddleware,
  //nivelAcessoMiddleware([1, 3]),
  new AjusteEstoqueControlador().tratar
)

export { rotas as estoque }
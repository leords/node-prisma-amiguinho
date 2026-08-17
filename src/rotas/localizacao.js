import { Router } from "express";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { criarLocalizacaoPedidoControlador } from "../controlador/localizacao/criarLocalizacaoPedidoControlador.js";
import { buscarLocalizacaoPedidosControlador } from "../controlador/localizacao/buscarLocalizacaoPedidosControlador.js";

const rotas = Router();


rotas.post('/criar-localizacao-pedido', 
    autenticadorMiddleware,
    new criarLocalizacaoPedidoControlador().tratar
);

rotas.get(
    '/buscar-localizacao-pedido', 
    autenticadorMiddleware,
    new buscarLocalizacaoPedidosControlador().tratar
);


export { rotas as localizacaoRotas }
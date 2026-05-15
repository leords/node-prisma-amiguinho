import { Router } from "express";
import { criarOrdemCompraControlador } from "../controlador/ordemCompra/criarOrdemCompraControlador.js";
import { ListarOrdemCompraControlador } from "../controlador/ordemCompra/listarOrdemCompraControlador.js";
import { EditarOrdemCompraControlador } from "../controlador/ordemCompra/editarOrdemCompraControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'



const rotas = Router();

rotas.post('/criar-ordem',
    autenticadorMiddleware,
    new criarOrdemCompraControlador().tratar
)

rotas.get('/buscar-ordem',
    autenticadorMiddleware,
    new ListarOrdemCompraControlador().tratar
)

rotas.patch('/editar-ordem/:id',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new EditarOrdemCompraControlador().tratar
)


export { rotas as ordemCompraRotas }
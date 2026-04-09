import { Router } from "express";
import { CriarOrdemCompraControlador } from "../controlador/ordemCompra/CriarOrdemCompraControlador.js";
import { ListarOrdemCompraControlador } from "../controlador/ordemCompra/listarOrdemCompraControlador.js";
import { EditarOrdemCompraControlador } from "../controlador/ordemCompra/editarOrdemCompraControlador.js";



const rotas = Router();

rotas.post('/criar-ordem', 
     //autenticadorMiddleware, 
     new CriarOrdemCompraControlador().tratar
    )

rotas.get('/buscar-ordem',
     //autenticadorMiddleware,
    new ListarOrdemCompraControlador().tratar
)

rotas.patch('/editar-ordem/:id',
    //autenticadorMiddleware,
    new EditarOrdemCompraControlador().tratar
)


export { rotas as ordemCompraRotas }
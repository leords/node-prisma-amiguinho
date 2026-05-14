import { Router } from "express";
import { CriarFechamentoControlador } from "../controlador/fechamento/criarFechamentoControlador.js";
import { BuscarDiferencasFechamentoControlador } from "../controlador/fechamento/buscarDiferencasFechamentoControlador.js";
import { EditarFechamentoControlador } from "../controlador/fechamento/editarFechamentoControlador.js";
import { DeletarFechamentoControlador } from "../controlador/fechamento/deletarFechamentoControlador.js";
import { BuscarFechamentoControlador } from "../controlador/fechamento/buscarFechamentoControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'


const rotas = Router();

rotas.post('/criar-fechamento/:setor',
    autenticadorMiddleware,
    new CriarFechamentoControlador().tratar);

rotas.get('/buscar-fechamento/:setor',
    autenticadorMiddleware,
     new BuscarFechamentoControlador().tratar);

rotas.patch('/editar-fechamento/:id',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new EditarFechamentoControlador().tratar);


rotas.delete('/deletar-fechamento/:id', 
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new DeletarFechamentoControlador().tratar);

rotas.get('/buscar-diferencas-fechamento/:setor',
    autenticadorMiddleware,
    new BuscarDiferencasFechamentoControlador().tratar);


export { rotas as fechamentoRotas }
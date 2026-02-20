import { Router } from "express";
import { CriarFechamentoControlador } from "../controlador/fechamento/criarFechamentoControlador.js";
import { BuscarDiferencasFechamentoControlador } from "../controlador/fechamento/buscarDiferencasFechamentoControlador.js";
import { EditarFechamentoControlador } from "../controlador/fechamento/editarFechamentoControlador.js";
import { DeletarFechamentoControlador } from "../controlador/fechamento/deletarFechamentoControlador.js";
import { BuscarFechamentoControlador } from "../controlador/fechamento/buscarFechamentoControlador.js";


const rotas = Router();

rotas.post('/criar-fechamento/:setor', new CriarFechamentoControlador().tratar);
rotas.get('/buscar-fechamento/:setor', new BuscarFechamentoControlador().tratar);
rotas.patch('/editar-fechamento/:id', new EditarFechamentoControlador().tratar);
rotas.delete('/deletar-fechamento/:id', new DeletarFechamentoControlador().tratar);
rotas.get('/buscar-diferencas-fechamento/:setor', new BuscarDiferencasFechamentoControlador().tratar);


export { rotas as fechamentoRotas }
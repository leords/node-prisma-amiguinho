import { Router } from "express";
import { CriarFechamentoControlador } from "../controlador/fechamendo/criarFechamentoControlador.js";
import { BuscarDiferencasFechamentoControlador } from "../controlador/fechamendo/buscarDiferencasFechamentoControlador.js";
import { EditarFechamentoControlador } from "../controlador/fechamendo/editarFechamentoControlador.js";
import { DeletarFechamentoControlador } from "../controlador/fechamendo/deletarFechamentoControlador.js";
import { BuscarFechamentoControlador } from "../controlador/fechamendo/buscarFechamentoControlador.js";


const rotas = Router();

rotas.post('/criar-fechamento/:setor', new CriarFechamentoControlador().tratar);
rotas.get('/buscar-fechamento/:setor', new BuscarFechamentoControlador().tratar);
rotas.patch('/editar-fechamento/:id', new EditarFechamentoControlador().tratar);
rotas.delete('/deletar-fechamento/:id', new DeletarFechamentoControlador().tratar);
rotas.get('/buscar-diferencas-fechamento/:setor', new BuscarDiferencasFechamentoControlador().tratar);


export { rotas as fechamentoRotas }
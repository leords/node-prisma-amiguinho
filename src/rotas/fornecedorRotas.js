import { Router } from "express";
import { ListarFornecedorControlador } from "../controlador/fornecedor/listarFornecedorControlador.js";
import { CriarFornecedorControlador } from "../controlador/fornecedor/criarFornecerControlador.js";
import { EditarStatusFornecedorControlador } from "../controlador/fornecedor/editarStatusFornecedorControlador.js";
import { EditarFornecedorControlador } from "../controlador/fornecedor/editarFornecedorControlador.js";


const rotas = Router();

rotas.post('/criar-fornecedor', new CriarFornecedorControlador().tratar)
rotas.get('/ler-fornecedores', new ListarFornecedorControlador().tratar)
rotas.patch('/editar-status-fornecedor/:id', new EditarStatusFornecedorControlador().tratar)
rotas.patch('/editar-fornecedor/:id', new EditarFornecedorControlador().tratar)


export { rotas as fornecedorRotas }
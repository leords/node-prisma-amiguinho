import { Router } from "express";
import { ListarFornecedorControlador } from "../controlador/fornecedor/listarFornecedorControlador.js";
import { CriarFornecedorControlador } from "../controlador/fornecedor/criarFornecerControlador.js";
import { EditarStatusFornecedorControlador } from "../controlador/fornecedor/editarStatusFornecedorControlador.js";
import { EditarFornecedorControlador } from "../controlador/fornecedor/editarFornecedorControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'


const rotas = Router();

rotas.post('/criar-fornecedor', 
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new CriarFornecedorControlador().tratar)

rotas.get('/ler-fornecedores',
    autenticadorMiddleware, 
    new ListarFornecedorControlador().tratar)

rotas.patch('/editar-status-fornecedor/:id',
    autenticadorMiddleware, 
    nivelAcessoMiddleware(['ADMIN']),
    new EditarStatusFornecedorControlador().tratar)

rotas.patch('/editar-fornecedor/:id',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new EditarFornecedorControlador().tratar)


export { rotas as fornecedorRotas }
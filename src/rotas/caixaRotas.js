import { Router } from "express";
import { alterarCaixaControlador } from "../controlador/caixa/alterarCaixaControlador.js";
import { lerCaixaControlador } from "../controlador/caixa/lerCaixaControlador.js";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from "../middleware/nivelAcessoMiddleware.js";


const rotas = Router()


rotas.post(
    '/ajustar-inicio-caixa',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new alterarCaixaControlador().tratar
)

rotas.get(
    '/ler-inicio-caixa',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new lerCaixaControlador().tratar

)


export { rotas as caixasRotas }
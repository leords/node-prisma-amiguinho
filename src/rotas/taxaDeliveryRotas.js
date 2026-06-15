import { Router } from "express";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { nivelAcessoMiddleware } from "../middleware/nivelAcessoMiddleware.js";
import { alterarTaxaEntregaControlador } from "../controlador/taxaDelivery/alterarTaxaEntregaControlador.js";
import { lerTaxaEntregaControlador } from "../controlador/taxaDelivery/lerTaxaEntregaControlador.js";


const rotas = Router()


rotas.post(
    '/ajustar-taxa-delivery',
    autenticadorMiddleware,
    nivelAcessoMiddleware(['ADMIN']),
    new alterarTaxaEntregaControlador().tratar
)

rotas.get(
    '/ler-taxa-delivery',
    autenticadorMiddleware,
    new lerTaxaEntregaControlador().tratar

)


export { rotas as taxaDeliveryRotas }
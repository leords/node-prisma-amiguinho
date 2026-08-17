import { Router } from "express";
import { autenticadorMiddleware } from "../middleware/autenticadorMiddleware.js";
import { DashboardControlador } from "../controlador/dashboard/dashboardControlador.js";


const rotas = Router();


rotas.get(
    "/relatorio-dia", 
    autenticadorMiddleware,
    new DashboardControlador().tratar
)


export { rotas as dashboardRotas }



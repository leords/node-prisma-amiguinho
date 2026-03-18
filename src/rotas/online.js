import { Router } from "express";
import { OnlineControlador } from "../controlador/online/onlineControlador.js";

const rotas = Router()

rotas.get('/online', new OnlineControlador().tratar)

export { rotas as onlineRotas }
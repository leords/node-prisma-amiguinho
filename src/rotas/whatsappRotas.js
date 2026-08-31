import { Router } from "express";
import { processarMensagemWhatsAppControlador } from "../controlador/whatsapp/webHookWhatsControlador.js";


const rotas = Router();

rotas.post(
    '/webhook/whatsapp',
    new processarMensagemWhatsAppControlador().tratar
)


export { rotas as whatsappRotas }



//http://localhost:4000/webhook/whatsapp
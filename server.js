import express from "express";
import cors from "cors";
import { rotas } from "./src/rotas/rotas.js";
import { registroRotas } from "./src/middleware/registroRotasMiddleware.js";
import { tratarErros } from "./src/middleware/tratarError.js";
const app = express();

// Libera requisições de origens diferentes
app.use(cors());

// permitir JSON
app.use(express.json());

// Middleware de registro de rotas
app.use(registroRotas);

// Rotas
app.use(rotas);

// Middleware de controle de erros. obs: middleware com 4 parametros é de monitoramento de erros.
app.use(tratarErros);

// Inciiar o servidor
app.listen(4000, () => console.log("Servidor iniciado na porta 4000"));

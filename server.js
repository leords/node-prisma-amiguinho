import express from "express";
import cors from "cors";
import { rotas } from "./src/rotas/rotas.js";
import { registroRotas } from "./src/middleware/registroRotasMiddleware.js";
import { tratarErros } from "./src/middleware/tratarError.js";
import { CriarUsuarioAdminServico } from "./src/servico/usuario/criarUsuarioAdminServico.js";
import { iniciarJobs } from "./src/jobs/index.js";
import { alterarCaixaServico } from "./src/servico/caixa/alterarCaixaServico.js";
import { alterarTaxaEntregaServico } from "./src/servico/taxaDelivery/alterarTaxaEntregaServico.js";

//dotenv.config();
const app = express();

// Libera requisições de origens diferentes
app.use(cors());

// permitir JSON
app.use(express.json());

// Middleware de registro de rotas = log.
app.use(registroRotas);

// Desabilita cache em todas as rotas pq o Railway tem um proxy reverso na frente que faz cache automaticamente de respostas GET
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});

// Rotas
app.use(rotas);

// Middleware de controle de erros. obs: middleware com 4 parametros é de monitoramento de erros.
app.use(tratarErros);


// Chamar a função de criar o usuario admin já ao executar o sistema.
const servico = new CriarUsuarioAdminServico()
await servico.executar();

// Chamar função para criar inicio de caixa = R$ 200,00
const servicoCaixa = new alterarCaixaServico()
await servicoCaixa.executar();

// Chamar função para criar taxa de entrega = R$ 5,00
const servicoTaxaEntrega = new alterarTaxaEntregaServico();
await servicoTaxaEntrega.executar()


const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
    iniciarJobs()
});



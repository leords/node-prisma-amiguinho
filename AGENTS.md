# Guia de Desenvolvimento & Padrões do Projeto — Amiguinho Central

Este documento serve como diretriz e instrução mandatória para desenvolvedores e agentes de IA que trabalham neste repositório. O objetivo é garantir **consistência arquitetural, manutenibilidade, legibilidade e respeito absoluto aos padrões já estabelecidos no projeto**.

---

## 1. Visão Geral do Projeto e Domínio do Negócio

O **Amiguinho Central** é o backend (API REST + WebSockets + Jobs) da **Amigão Distribuidora de Bebidas**. O sistema controla toda a esteira operacional, logística e financeira da distribuidora, dividida em três canais principais:

1. **Balcão**: Vendas diretas presenciais, suporte a múltiplos pagamentos parciais no mesmo pedido (dinheiro, PIX, cartões) e baixa imediata de estoque.
2. **Delivery**: Pedidos de entrega, controle de taxa de entrega, ciclo de vida de entrega e rastreamento GPS de entregadores via WebSocket.
3. **Externo**: Vendas em campo realizadas por vendedores externos via aplicativo mobile, roteirização, agrupamento em **Cargas** para despacho em veículos e controle financeiro de contas a receber (**Pendências / Vales**) com prestação de contas (**Pagamentos Coletados vs. Baixados**).

---

## 2. Stack Tecnológica

* **Runtime:** Node.js (ES Modules — `"type": "module"`)
* **Framework Web:** Express 5 (`^5.1.0`)
* **ORM:** Prisma ORM 6 (`@prisma/client`, `prisma`, PostgreSQL)
* **Tempo Real:** Socket.io (`^4.8.3`)
* **Tarefas Agendadas (Cron Jobs):** node-cron (`^4.2.1`)
* **Autenticação:** JWT (`jsonwebtoken`) com Access Token (10h) + Refresh Token (7d) persistido no banco e hash com `bcryptjs`
* **Inteligência Artificial:** Groq SDK (`groq-sdk`) e OpenRouter API com fallback de modelos gratuitos
* **Notificações & Mensageria:** Resend (E-mails transacionais), Evolution API (WhatsApp) e Expo Server SDK (Push Notifications)

---

## 3. Estrutura de Diretórios e Arquitetura em Camadas

A aplicação segue uma **Arquitetura em Camadas (Layered Architecture)** desacoplada e modular:

```
src/
├── auth/          # Autenticação, geração de Access Token e rotação de Refresh Token
├── config/        # Constantes globais, HTTP Status Codes e dicionário de mensagens
├── controlador/   # Controllers (recebem req/res, validam dados de entrada e chamam serviços)
├── error/         # Classe de erro customizada (AppError)
├── jobs/          # Tarefas agendadas (sincronização Sheets, IA diária, alertas de positivação)
├── middleware/    # Middlewares (autenticação JWT, controle de acesso RBAC, tratamento de erro)
├── prisma/        # Instância singleton do PrismaClient
├── rotas/         # Roteamento modular do Express agrupado por domínio
├── servico/       # Regras de negócio, cálculos, transações e queries do Prisma
├── socket/        # Handlers de eventos WebSocket (painel <-> entregadores)
└── utilidades/    # Funções utilitárias (IA OpenRouter/Groq, WhatsApp, validadores)
```

---

## 4. Convenções Fundamentais de Código

1. **Idioma do Código:** **100% em Português** para nomes de classes, métodos, variáveis, tabelas do banco, comentários e mensagens de erro/sucesso.
2. **Nomenclatura de Arquivos:** `camelCase` terminando com a função da camada (ex: `criarPedidoControlador.js`, `criarPedidoServico.js`, `pedidoRotas.js`).
3. **Nomenclatura de Classes:** `PascalCase` (ex: `CriarPedidoControlador`, `CriarPedidoServico`, `AppError`).
4. **Imports:** Sempre usar extensão `.js` no final de imports relativos (ex: `import { AppError } from '../error/appError.js'`).
5. **Formatação:** Aspas simples (`'...'`), sem ponto e vírgula desnecessário (conforme `.prettierrc`), indentação de 2 espaços.

---

## 5. Padrão dos Controladores (Controllers)

Cada controlador deve ser uma **classe** contendo o método assíncrono `tratar(req, res, next)`:

* **Responsabilidades:**
  1. Extrair e validar os dados de `req.body`, `req.params`, `req.query` e `req.user`.
  2. Lançar `AppError` com código e status HTTP caso dados obrigatórios estejam ausentes ou com tipagem incorreta.
  3. Instanciar o serviço correspondente e invocar o método `executar(...)`.
  4. Retornar resposta JSON com o status code correto (ex: `HTTP_STATUS_CODES.CREATED`, `HTTP_STATUS_CODES.OK`) e mensagens padronizadas de [httpStatusCodes.js](file:///c:/Users/Léo/Desktop/projetos/amigao/node-amiguinho-central/src/config/httpStatusCodes.js).
  5. Envolver tudo em bloco `try/catch` e repassar qualquer exceção para o middleware chamando `next(error)`.

```javascript
// Exemplo de Controlador Padronizado
import { CriarMotoristaServico } from '../../servico/motorista/criarMotoristaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_MOTORISTA,
} from '../../config/httpStatusCodes.js'

class CriarMotoristaControlador {
  async tratar(req, res, next) {
    try {
      const { nome, cpf, telefone } = req.body

      const servico = new CriarMotoristaServico()
      const resultado = await servico.executar({ nome, cpf, telefone })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_MOTORISTA.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarMotoristaControlador }
```

---

## 6. Padrão dos Serviços (Services)

Cada serviço encapsula **uma regra de negócio específica** através do método assíncrono `executar(...)`:

* **Responsabilidades:**
  1. Validar regras de negócio e integridade no banco de dados.
  2. Lançar `AppError` para regras violadas (ex: registros duplicados, estoque insuficiente, registro não encontrado).
  3. Utilizar `prismaCliente` singleton importado de `../../prisma/index.js`.
  4. Para operações que envolvam mais de uma tabela ou atualização crítica, utilizar **transações atômicas** com `prismaCliente.$transaction(async (prisma) => { ... })`.
  5. Retornar os dados puros (objetos/arrays) para o controlador.

```javascript
// Exemplo de Serviço Padronizado
import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_MOTORISTA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarMotoristaServico {
  async executar({ nome, cpf, telefone }) {
    if (!nome || !cpf) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.CAMPO_AUSENTE,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CAMPO_AUSENTE'
      )
    }

    const cpfFormatado = String(cpf).replace(/\D/g, '')

    const motoristaExistente = await prismaCliente.motorista.findUnique({
      where: { cpf: cpfFormatado },
    })

    if (motoristaExistente) {
      throw new AppError(
        ERRO_MSG_MOTORISTA.CPF_JA_EXISTE,
        HTTP_STATUS_CODES.CONFLICT,
        'CPF_JA_EXISTE'
      )
    }

    return await prismaCliente.motorista.create({
      data: {
        nome: String(nome).trim(),
        cpf: cpfFormatado,
        telefone: telefone ? String(telefone).trim() : null,
      },
    })
  }
}

export { CriarMotoristaServico }
```

---

## 7. Padrão das Rotas (Routes)

* Definidas com `Router()` do Express.
* Protegidas pelo middleware `autenticadorMiddleware` (para checagem do token JWT).
* Quando restrito a perfis específicos, usar `nivelAcessoMiddleware(['ADMIN', 'VENDAS', ...])`.
* As rotas instanciam o controlador diretamente no callback: `new MeuControlador().tratar`.
* Todas as rotas filhas são importadas e registradas no arquivo agregador central [src/rotas/rotas.js](file:///c:/Users/Léo/Desktop/projetos/amigao/node-amiguinho-central/src/rotas/rotas.js).

```javascript
// Exemplo de Rota Padronizada
import { Router } from 'express'
import { CriarMotoristaControlador } from '../controlador/motorista/criarMotoristaControlador.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'

const rotas = Router()

rotas.post(
  '/motoristas',
  autenticadorMiddleware,
  nivelAcessoMiddleware(['ADMIN']),
  new CriarMotoristaControlador().tratar
)

export { rotas as motoristaRotas }
```

---

## 8. Dicionário Central de Mensagens e Códigos de Status

Todas as mensagens e códigos HTTP devem ser centralizados em [src/config/httpStatusCodes.js](file:///c:/Users/Léo/Desktop/projetos/amigao/node-amiguinho-central/src/config/httpStatusCodes.js). **Nunca insira strings soltas ou números mágicos de status HTTP diretamente nos controladores ou serviços.**

* `HTTP_STATUS_CODES`: `OK (200)`, `CREATED (201)`, `BAD_REQUEST (400)`, `UNAUTHORIZED (401)`, `FORBIDDEN (403)`, `NOT_FOUND (404)`, `CONFLICT (409)`, `INTERNAL_SERVER_ERROR (500)`.
* `ERRO_MSG_<DOMINIO>`: Mensagens de erro padronizadas.
* `SUCESSO_MSG_<DOMINIO>`: Mensagens de sucesso padronizadas.

---

## 9. Tratamento de Erros com `AppError`

Os erros da aplicação utilizam a classe customizada [AppError](file:///c:/Users/Léo/Desktop/projetos/amigao/node-amiguinho-central/src/error/appError.js):

```javascript
throw new AppError('Mensagem do erro', statusCode, 'CODIGO_DO_ERRO')
```

O middleware global [tratarErros.js](file:///c:/Users/Léo/Desktop/projetos/amigao/node-amiguinho-central/src/middleware/tratarError.js) intercepta automaticamente os erros e formata a resposta JSON padrão:

```json
{
  "sucesso": false,
  "erro": {
    "mensagem": "Motorista não encontrado",
    "codigo": "MOTORISTA_NOT_FOUND"
  }
}
```

---

## 10. Regras de Negócio Cruciais do Sistema

1. **Conversão de Estoque (UND $\rightarrow$ Caixa):**
   * Produtos têm o campo `quantidade` (quantidade de unidades que compõem uma caixa/fardo).
   * Ao vender unidades individuais, calcula-se `quantidadeTransformada = item.quantidade / produto.quantidade` para debitar ou estornar o campo `estoque` na tabela `Produto` e registrar em `Estoque`.
2. **Cargas & Cálculo de Peso:**
   * A montagem de carga calcula o peso somando `item.quantidade * produto.peso` de todos os itens dos pedidos vinculados.
3. **Ciclo de Vida de Cargas & Gatilho de Vales:**
   * A entidade `Carga` possui exatamente 3 status: `'pendente'`, `'rota'` e `'finalizada'`.
   * Na criação da carga (`'pendente'`), os pedidos associados passam para `'carregado'`.
   * Ao despachar a carga (`PATCH /cargas/:id/finalizar`), seu status transita de `'pendente'` para `'rota'` e pedidos com forma de pagamento contendo `VALE` disparam automaticamente a criação de um registro na tabela `Pendencia` com prazo de vencimento de **7 dias**.
   * Cargas com status `'rota'` ou `'finalizada'` não podem ser canceladas, nem receber novos pedidos ou ter pedidos removidos.
4. **Pendências & Pagamentos:**
   * Pagamento registrado por usuário com perfil `EXTERNO` (vendedor/cobrador na rua) nasce com status `'coletado'`.
   * Pagamento registrado por `ADMIN` (conferência de caixa) nasce com status `'baixado'`.
   * O `valorPago` da pendência é recalculado somando os pagamentos não cancelados, transitando o status da pendência:
     * `totalPago >= pendencia.valor` $\rightarrow$ `'fechada'`
     * `totalPago > 0` $\rightarrow$ `'parcial'`
     * `totalPago === 0` $\rightarrow$ `'aberta'`
5. **Transações no Prisma:**
   * Sempre que uma mutação envolver mais de uma tabela ou consistência financeira/estoque, utilize `prismaCliente.$transaction(...)`.

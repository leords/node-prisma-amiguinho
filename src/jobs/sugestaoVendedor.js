// src/jobs/sugestaoVendedor.js
import { PrismaClient } from "@prisma/client";
import { gerarTextoGroq } from "../utilidades/groq.js";
import { enviarWhatsApp } from "../utilidades/whatsapp.js";

const prisma = new PrismaClient();

// Quantos dias de histórico considerar por cliente
const DIAS_HISTORICO = 60;

export async function executarSugestaoVendedor() {
  console.log("[JOB] Iniciando sugestão de pedido para vendedores...");

  const hoje = new Date();
  const inicioPeriodo = new Date(hoje);
  inicioPeriodo.setDate(hoje.getDate() - DIAS_HISTORICO);

  try {
    // ── 1. Busca vendedores externos ativos com WhatsApp ──────────
    const vendedores = await prisma.usuario.findMany({
      where: {
        nivelAcessoId: "EXTERNO",
        status: true,
        whatsapp: { not: null },
      },
      select: { id: true, nome: true, whatsapp: true, usuario: true },
    });

    if (vendedores.length === 0) {
      console.log("[JOB] Nenhum vendedor externo com WhatsApp cadastrado.");
      return;
    }

    for (const vendedor of vendedores) {
      // ── 2. Busca clientes do vendedor ─────────────────────────
      const clientes = await prisma.clienteExterno.findMany({
        where: { vendedor: vendedor.usuario },
        select: { id: true, nome: true },
      });

      if (clientes.length === 0) continue;

      // ── 3. Para cada cliente, busca histórico de pedidos ──────
      const dadosClientes = [];

      for (const cliente of clientes) {
        const pedidos = await prisma.pedidoExterno.findMany({
          where: {
            clienteId: cliente.id,
            data: { gte: inicioPeriodo, lte: hoje },
          },
          include: { itens: { include: { produto: true } } },
          orderBy: { data: "desc" },
        });

        if (pedidos.length === 0) continue;

        const ultimoPedido = pedidos[0];
        const diasDesdeUltimoPedido = Math.floor(
          (hoje.getTime() - ultimoPedido.data.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Produtos mais comprados
        const contagemProdutos = {};
        pedidos.forEach((p) => {
          p.itens.forEach((item) => {
            const nome = item.produto.nome;
            if (!contagemProdutos[nome]) contagemProdutos[nome] = 0;
            contagemProdutos[nome] += item.quantidade;
          });
        });

        const topProdutos = Object.entries(contagemProdutos)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([nome, qtd]) => `${nome} (${qtd} un. em ${DIAS_HISTORICO} dias)`);

        const ticketMedio = pedidos.reduce((acc, p) => acc + p.total, 0) / pedidos.length;

        dadosClientes.push({
          nome:                  cliente.nome,
          totalPedidos:          pedidos.length,
          diasDesdeUltimoPedido,
          ticketMedio:           ticketMedio.toFixed(2),
          topProdutos,
        });
      }

      if (dadosClientes.length === 0) continue;

      // ── 4. Gera sugestão com Groq ─────────────────────────────
      const prompt = `
            Você é um assistente de vendas de uma distribuidora de bebidas.
            O vendedor ${vendedor.nome} vai sair para visitar clientes hoje.

            Com base no histórico abaixo, escreva sugestões práticas de abordagem para cada cliente.
            Para cada um, sugira quais produtos oferecer e se é um bom momento para visitar (baseado nos dias desde o último pedido).
            Seja direto, use linguagem informal e profissional. Sem markdown, apenas texto simples com emojis leves.

            Clientes e histórico:
            ${dadosClientes.map((c) => `
            Cliente: ${c.nome}
            - Pedidos nos últimos ${DIAS_HISTORICO} dias: ${c.totalPedidos}
            - Dias desde o último pedido: ${c.diasDesdeUltimoPedido}
            - Ticket médio: R$ ${c.ticketMedio}
            - Produtos mais comprados: ${c.topProdutos.join(", ")}
        `).join("\n")}

        Escreva as sugestões agora:
        `.trim();

      const sugestao = await gerarTextoGroq(prompt);

      // ── 5. Envia por WhatsApp ─────────────────────────────────
      const mensagem = `🛵 Bom dia, ${vendedor.nome}! Aqui estão as sugestões para sua rota de hoje:\n\n${sugestao}`;
      await enviarWhatsApp(vendedor.whatsapp, mensagem);

      console.log(`[JOB] Sugestão enviada para vendedor: ${vendedor.nome}`);
    }

    console.log("[JOB] Sugestões de vendedor concluídas.");
  } catch (err) {
    console.error("[JOB] Erro na sugestão de vendedor:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
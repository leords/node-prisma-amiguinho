// src/jobs/resumoDiario.js
import { PrismaClient } from "@prisma/client";
import { gerarTextoGroq } from "../utilidades/groq.js";
import { enviarEmail }    from "../utilidades/email.js";
import { enviarWhatsApp } from "../utilidades/whatsapp.js";

const prisma = new PrismaClient();

export async function executarResumoDiario() {
  console.log("[JOB] Iniciando resumo diário...");

  const hoje = new Date();
  const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
  const fimDia    = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);

  try {
    // 1. Busca dados do dia via Prisma
    const [pedidosBalcao, pedidosDelivery, pedidosExterno, fechamento] = await Promise.all([
      prisma.pedidoBalcao.findMany({
        where: { data: { gte: inicioDia, lte: fimDia } },
        include: { itens: { include: { produto: true } } },
      }),
      prisma.pedidoDelivery.findMany({
        where: { data: { gte: inicioDia, lte: fimDia } },
        include: { itens: { include: { produto: true } } },
      }),
      prisma.pedidoExterno.findMany({
        where: { data: { gte: inicioDia, lte: fimDia } },
        include: { itens: { include: { produto: true } } },
      }),
      prisma.fechamento.findMany({
        where: {
          data: { gte: inicioDia, lte: fimDia },
          status: "fechado",
        },
      }),
    ]);

    // 2. Calcula totais
    const totalBalcao   = pedidosBalcao.reduce((acc, p) => acc + p.total, 0);
    const totalDelivery = pedidosDelivery.reduce((acc, p) => acc + p.total, 0);
    const totalExterno  = pedidosExterno.reduce((acc, p) => acc + p.total, 0);
    const totalGeral    = totalBalcao + totalDelivery + totalExterno;
    const totalPedidos  = pedidosBalcao.length + pedidosDelivery.length + pedidosExterno.length;

    // Top 3 produtos do dia (todos os setores)
    const contagemProdutos = {};
    [...pedidosBalcao, ...pedidosDelivery, ...pedidosExterno].forEach((pedido) => {
      pedido.itens.forEach((item) => {
        const nome = item.produto.nome;
        if (!contagemProdutos[nome]) contagemProdutos[nome] = { quantidade: 0, total: 0 };
        contagemProdutos[nome].quantidade += item.quantidade;
        contagemProdutos[nome].total      += item.valorTotal;
      });
    });

    const topProdutos = Object.entries(contagemProdutos)
      .sort((a, b) => b[1].quantidade - a[1].quantidade)
      .slice(0, 3)
      .map(([nome, dados]) => ({ nome, ...dados }));

    // Diferenças de fechamento
    const diferencasCaixa = fechamento.map((f) => ({
      setor: f.setor,
      vendedor: f.vendedor,
      diferenca: f.diferenca,
      status: f.diferenca === 0 ? "exato" : f.diferenca > 0 ? "sobra" : "falta",
    }));

    // 3. Monta contexto e envia ao Groq
    const dataFormatada = hoje.toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });

    const prompt = `
        Você é um assistente de gestão de uma distribuidora de bebidas chamada Amigão Distribuidora.
        Escreva um resumo diário em português, de forma clara, objetiva e profissional.
        Use no máximo 5 parágrafos curtos. Não use markdown, apenas texto simples.
        Inclua emojis sutis para facilitar a leitura.

        Data: ${dataFormatada}

        Dados do dia:
        - Total geral vendido: R$ ${totalGeral.toFixed(2)}
        - Total de pedidos: ${totalPedidos}
        - Balcão: R$ ${totalBalcao.toFixed(2)} (${pedidosBalcao.length} pedidos)
        - Delivery: R$ ${totalDelivery.toFixed(2)} (${pedidosDelivery.length} pedidos)
        - Externo: R$ ${totalExterno.toFixed(2)} (${pedidosExterno.length} pedidos)
        - Top 3 produtos: ${topProdutos.map((p) => `${p.nome} (${p.quantidade} un.)`).join(", ")}
        - Fechamentos: ${diferencasCaixa.length === 0 ? "Nenhum fechamento registrado" : diferencasCaixa.map((d) => `${d.vendedor} (${d.setor}): ${d.status} de R$ ${Math.abs(d.diferenca).toFixed(2)}`).join(", ")}

        Escreva o resumo agora:
        `.trim();

    const resumo = await gerarTextoGroq(prompt);

    // 4. Busca admins com contato cadastrado
    const admins = await prisma.usuario.findMany({
      where: { nivelAcessoId: "ADMIN", status: true },
      select: { nome: true, email: true, whatsapp: true },
    });

    if (admins.length === 0) {
      console.warn("[JOB] Nenhum admin encontrado para envio do resumo.");
      return;
    }

    // 5. Envia para cada admin
    const assunto = `📊 Resumo do dia — ${hoje.toLocaleDateString("pt-BR")}`;

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff8c00; padding: 20px 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">📊 Resumo Diário</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">${dataFormatada}</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.7; color: #333; font-size: 15px;">${resumo}</pre>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa; margin: 0;">Amigão Distribuidora de Bebidas — Sistema de Gestão</p>
        </div>
      </div>
    `;

    // enviando email e wpps para todos os usuarios que são ADMIN
    for (const admin of admins) {
      if (admin.email) {
        await enviarEmail({ para: admin.email, assunto, html: htmlEmail });
      }
      if (admin.whatsapp) {
        await enviarWhatsApp(admin.whatsapp, `${assunto}\n\n${resumo}`);
      }
    }

    console.log("[JOB] Resumo diário enviado com sucesso.");
  } catch (err) {
    console.error("[JOB] Erro no resumo diário:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
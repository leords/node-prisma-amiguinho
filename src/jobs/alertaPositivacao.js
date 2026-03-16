// src/jobs/alertaPositivacao.js
import { PrismaClient } from "@prisma/client";
import { gerarTextoGroq } from "../utilidades/groq.js";
import { enviarEmail }    from "../utilidades/email.js";
import { enviarWhatsApp } from "../utilidades/whatsapp.js";

const prisma = new PrismaClient();

// Queda mínima para disparar o alerta (em pontos percentuais)
const LIMITE_QUEDA_PERCENTUAL = 20;

export async function executarAlertaPositivacao() {
  console.log("[JOB] Iniciando alerta de positivação...");

  const hoje   = new Date();
  const seteDiasAtras    = new Date(hoje); seteDiasAtras.setDate(hoje.getDate() - 7);
  const quatorzeDiasAtras = new Date(hoje); quatorzeDiasAtras.setDate(hoje.getDate() - 14);

  try {
    // 1. Busca todos os produtos
    const produtos = await prisma.produto.findMany({
      select: { id: true, nome: true },
    });

    // 2. Total de pedidos por período
    const [totalPedidosSemanaAtual, totalPedidosSemanaAnterior] = await Promise.all([
      prisma.pedidoBalcao.count({ where: { data: { gte: seteDiasAtras, lte: hoje } } }),
      prisma.pedidoBalcao.count({ where: { data: { gte: quatorzeDiasAtras, lte: seteDiasAtras } } }),
    ]);

    if (totalPedidosSemanaAtual === 0 || totalPedidosSemanaAnterior === 0) {
      console.log("[JOB] Dados insuficientes para calcular positivação.");
      return;
    }

    // 3. Calcula positivação por produto
    const alertas = [];

    for (const produto of produtos) {
      const [pedidosComProdutoAtual, pedidosComProdutoAnterior] = await Promise.all([
        prisma.itemPedidoBalcao.groupBy({
          by: ["pedidoId"],
          where: {
            produtoId: produto.id,
            pedido: { data: { gte: seteDiasAtras, lte: hoje } },
          },
          _count: { pedidoId: true },
        }),
        prisma.itemPedidoBalcao.groupBy({
          by: ["pedidoId"],
          where: {
            produtoId: produto.id,
            pedido: { data: { gte: quatorzeDiasAtras, lte: seteDiasAtras } },
          },
          _count: { pedidoId: true },
        }),
      ]);

      const positAtual    = (pedidosComProdutoAtual.length    / totalPedidosSemanaAtual)    * 100;
      const positAnterior = (pedidosComProdutoAnterior.length / totalPedidosSemanaAnterior) * 100;
      const queda         = positAnterior - positAtual;

      if (positAnterior > 0 && queda >= LIMITE_QUEDA_PERCENTUAL) {
        alertas.push({
          produto:      produto.nome,
          positAtual:   positAtual.toFixed(1),
          positAnterior: positAnterior.toFixed(1),
          queda:        queda.toFixed(1),
        });
      }
    }

    if (alertas.length === 0) {
      console.log("[JOB] Nenhuma queda de positivação acima do limite.");
      return;
    }

    // 4. Gera análise com Groq
    const prompt = `
        Você é um assistente de gestão de uma distribuidora de bebidas.
        Os produtos abaixo tiveram queda significativa de positivação (% de pedidos que incluíram o produto)
        comparando a semana atual com a semana anterior.

        Produtos com alerta:
        ${alertas.map((a) => `- ${a.produto}: era ${a.positAnterior}%, agora ${a.positAtual}% (queda de ${a.queda}pp)`).join("\n")}

        Escreva um alerta em português, claro e direto, explicando a situação e sugerindo possíveis causas
        (estoque, sazonalidade, preço, concorrência). Máximo 4 parágrafos curtos. Sem markdown, só texto simples.
    `.trim();

    const analise = await gerarTextoGroq(prompt);

    // 5. Busca admins
    const admins = await prisma.usuario.findMany({
      where: { nivelAcessoId: "ADMIN", status: true },
      select: { nome: true, email: true, whatsapp: true },
    });

    if (admins.length === 0) {
      console.warn("[JOB] Nenhum admin encontrado para envio do alerta.");
      return;
    }

    // 6. Envia
    const assunto = `⚠️ Alerta de positivação — ${alertas.length} produto(s) em queda`;

    const tabelaHtml = alertas.map((a) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; font-weight: 600;">${a.produto}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center;">${a.positAnterior}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center;">${a.positAtual}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center; color: #c92a2a; font-weight: 700;">▼ ${a.queda}pp</td>
      </tr>
    `).join("");

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c92a2a; padding: 20px 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">⚠️ Alerta de Positivação</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">${alertas.length} produto(s) com queda acima de ${LIMITE_QUEDA_PERCENTUAL}%</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #868e96; text-transform: uppercase;">Produto</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Semana ant.</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Semana atual</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Variação</th>
              </tr>
            </thead>
            <tbody>${tabelaHtml}</tbody>
          </table>
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.7; color: #333; font-size: 15px;">${analise}</pre>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa; margin: 0;">Amigão Distribuidora de Bebidas — Sistema de Gestão</p>
        </div>
      </div>
    `;

    for (const admin of admins) {
      if (admin.email) {
        await enviarEmail({ para: admin.email, assunto, html: htmlEmail });
      }
      if (admin.whatsapp) {
        const msgWpp = `${assunto}\n\n${alertas.map((a) => `• ${a.produto}: ${a.positAnterior}% → ${a.positAtual}% (▼${a.queda}pp)`).join("\n")}\n\n${analise}`;
        await enviarWhatsApp(admin.whatsapp, msgWpp);
      }
    }

    console.log(`[JOB] Alerta de positivação enviado. ${alertas.length} produto(s) em alerta.`);
  } catch (err) {
    console.error("[JOB] Erro no alerta de positivação:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
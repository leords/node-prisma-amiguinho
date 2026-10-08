// src/jobs/alertaPositivacao.js
import { enviarWhatsApp } from '../utilidades/whatsapp.js'
import { EnviarEmailServico } from '../servico/email/enviarEmailServico.js'
import { buscarIA } from '../utilidades/gemini.js'
import prismaCliente from '../prisma/index.js'

// Queda mínima para disparar o alerta (em pontos percentuais)
const LIMITE_QUEDA_PERCENTUAL = 20

export async function executarAlertaPositivacao() {
  console.log('[JOB] Iniciando alerta de positivação com IA (Gemini)...')

  const hoje = new Date()
  const seteDiasAtras = new Date(hoje)
  seteDiasAtras.setDate(hoje.getDate() - 7)
  const quatorzeDiasAtras = new Date(hoje)
  quatorzeDiasAtras.setDate(hoje.getDate() - 14)

  try {
    // 1. Busca todos os produtos ativos
    const produtos = await prismaCliente.produto.findMany({
      select: { id: true, nome: true, estoque: true },
    })

    // 2. Total de pedidos por período (considerando Balcão)
    const [totalPedidosSemanaAtual, totalPedidosSemanaAnterior] =
      await Promise.all([
        prismaCliente.pedidoBalcao.count({
          where: { data: { gte: seteDiasAtras, lte: hoje } },
        }),
        prismaCliente.pedidoBalcao.count({
          where: { data: { gte: quatorzeDiasAtras, lte: seteDiasAtras } },
        }),
      ])

    if (totalPedidosSemanaAtual === 0 || totalPedidosSemanaAnterior === 0) {
      console.log('[JOB] Dados insuficientes para calcular positivação comparativa.')
      return
    }

    // 3. Calcula positivação por produto
    const alertas = []

    for (const produto of produtos) {
      const [pedidosComProdutoAtual, pedidosComProdutoAnterior] =
        await Promise.all([
          prismaCliente.itemPedidoBalcao.groupBy({
            by: ['pedidoId'],
            where: {
              produtoId: produto.id,
              pedido: { data: { gte: seteDiasAtras, lte: hoje } },
            },
            _count: { pedidoId: true },
          }),
          prismaCliente.itemPedidoBalcao.groupBy({
            by: ['pedidoId'],
            where: {
              produtoId: produto.id,
              pedido: { data: { gte: quatorzeDiasAtras, lte: seteDiasAtras } },
            },
            _count: { pedidoId: true },
          }),
        ])

      const positAtual =
        (pedidosComProdutoAtual.length / totalPedidosSemanaAtual) * 100
      const positAnterior =
        (pedidosComProdutoAnterior.length / totalPedidosSemanaAnterior) * 100
      const queda = positAnterior - positAtual

      if (positAnterior > 0 && queda >= LIMITE_QUEDA_PERCENTUAL) {
        alertas.push({
          produto: produto.nome,
          estoqueAtual: produto.estoque,
          positAtual: positAtual.toFixed(1),
          positAnterior: positAnterior.toFixed(1),
          queda: queda.toFixed(1),
        })
      }
    }

    if (alertas.length === 0) {
      console.log('[JOB] Nenhuma queda de positivação acima do limite detectada.')
      return
    }

    // 4. Gera análise estratégica com Gemini
    const prompt = `
Você é um consultor comercial especialista em distribuição de bebidas da Amigão Distribuidora.
Os produtos abaixo tiveram uma queda brusca de positivação (% de pedidos que levaram o produto) comparando esta semana com a semana anterior.

📋 Produtos em Alerta:
${alertas.map((a) => `• ${a.produto}: era ${a.positAnterior}%, caiu para ${a.positAtual}% (queda de ${a.queda}pp | Estoque atual: ${a.estoqueAtual} cx/un)`).join('\n')}

Escreva uma análise comercial direta e clara em português para a equipe de gestão:
1. Explique a gravidade da perda de penetração desses itens.
2. Aponte hipóteses reais de causa (falta de estoque/ruptura, aumento de preço, concorrência, perda de visibilidade no balcão).
3. Sugira 2 a 3 ações corretivas imediatas (ex: incentivo de vendas, combos promocionais, verificação de concorrência).

Formato: no máximo 4 parágrafos curtos, sem markdown pesado, texto limpo e profissional com emojis moderados.
    `.trim()

    const analise = await buscarIA(prompt)

    // 5. Busca administradores cadastrados e ativos
    const admins = await prismaCliente.usuario.findMany({
      where: { nivelAcesso: 'ADMIN', status: true },
      select: { nome: true, email: true, whatsapp: true },
    })

    if (admins.length === 0) {
      console.warn('[JOB] Nenhum admin encontrado para envio do alerta de positivação.')
      return
    }

    // 6. Formata e envia
    const assunto = `⚠️ Alerta de Positivação — ${alertas.length} produto(s) em queda`

    const tabelaHtml = alertas
      .map(
        (a) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; font-weight: 600;">${a.produto}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center;">${a.positAnterior}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center;">${a.positAtual}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f3f5; text-align: center; color: #c92a2a; font-weight: 700;">▼ ${a.queda}pp</td>
      </tr>
    `
      )
      .join('')

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #c92a2a; padding: 20px 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">⚠️ Alerta de Positivação de Produtos</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 14px;">${alertas.length} produto(s) com queda superior a ${LIMITE_QUEDA_PERCENTUAL}%</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #868e96; text-transform: uppercase;">Produto</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Semana Ant.</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Semana Atual</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #868e96; text-transform: uppercase;">Variação</th>
              </tr>
            </thead>
            <tbody>${tabelaHtml}</tbody>
          </table>
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.7; color: #333; font-size: 15px;">${analise}</pre>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa; margin: 0;">Amigão Distribuidora de Bebidas — Gestão Inteligente</p>
        </div>
      </div>
    `

    for (const admin of admins) {
      if (admin.email) {
        const emailServico = new EnviarEmailServico()
        await emailServico.enviarNovoEmail(admin.email, assunto, htmlEmail)
      }
      if (admin.whatsapp) {
        const msgWpp = `${assunto}\n\n${alertas.map((a) => `• ${a.produto}: ${a.positAnterior}% → ${a.positAtual}% (▼${a.queda}pp)`).join('\n')}\n\n${analise}`
        await enviarWhatsApp(admin.whatsapp, msgWpp)
      }
    }

    console.log(
      `[JOB] Alerta de positivação enviado para admins. ${alertas.length} produto(s) em alerta.`
    )
  } catch (err) {
    console.error('[JOB] Erro no alerta de positivação:', err.message)
  }
}

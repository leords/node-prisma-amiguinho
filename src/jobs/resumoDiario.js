// src/jobs/resumoDiario.js
import { enviarWhatsApp } from '../utilidades/whatsapp.js'
import { EnviarEmailServico } from '../servico/email/enviarEmailServico.js'
import { buscarIA } from '../utilidades/gemini.js'
import prismaCliente from '../prisma/index.js'

export async function executarResumoDiario() {
  console.log('[JOB] Iniciando resumo diário com IA (Gemini)...')

  const hoje = new Date()
  const inicioDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    0,
    0,
    0
  )
  const fimDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    23,
    59,
    59
  )

  try {
    // 1. Busca dados do dia via Prisma
    const [pedidosBalcao, pedidosDelivery, pedidosExterno, fechamento] =
      await Promise.all([
        prismaCliente.pedidoBalcao.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          include: { itens: { include: { produto: true } } },
        }),
        prismaCliente.pedidoDelivery.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          include: { itens: { include: { produto: true } } },
        }),
        prismaCliente.pedidoExterno.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          include: { itens: { include: { produto: true } } },
        }),
        prismaCliente.fechamento.findMany({
          where: {
            data: { gte: inicioDia, lte: fimDia },
            status: 'fechado',
          },
        }),
      ])

    // 2. Calcula totais e margens
    const totalBalcao = pedidosBalcao.reduce((acc, p) => acc + p.total, 0)
    const totalDelivery = pedidosDelivery.reduce((acc, p) => acc + p.total, 0)
    const totalExterno = pedidosExterno.reduce((acc, p) => acc + p.total, 0)
    const totalGeral = totalBalcao + totalDelivery + totalExterno
    const totalPedidos =
      pedidosBalcao.length + pedidosDelivery.length + pedidosExterno.length

    if (totalPedidos === 0 && fechamento.length === 0) {
      console.log('[JOB] Nenhum movimento registrado hoje para envio do resumo.')
      return
    }

    const todosPedidos = [
      ...pedidosBalcao,
      ...pedidosDelivery,
      ...pedidosExterno,
    ]

    let custoTotalEstimado = 0
    const contagemProdutos = {}

    todosPedidos.forEach((pedido) => {
      pedido.itens.forEach((item) => {
        const nome = item.produto.nome
        const precoCompra = Number(item.produto.precoCompra) || 0
        const precoVenda = Number(item.valorUnit) || 0

        if (!contagemProdutos[nome]) {
          contagemProdutos[nome] = {
            quantidade: 0,
            total: 0,
            lucro: 0,
          }
        }

        const custoItem = item.quantidade * precoCompra
        const lucroItem = item.valorTotal - custoItem

        custoTotalEstimado += custoItem
        contagemProdutos[nome].quantidade += item.quantidade
        contagemProdutos[nome].total += item.valorTotal
        contagemProdutos[nome].lucro += lucroItem
      })
    })

    const lucroEstimado = totalGeral - custoTotalEstimado
    const margemMediaLucro =
      totalGeral > 0 ? (lucroEstimado / totalGeral) * 100 : 0

    // Top 3 produtos mais vendidos
    const topProdutos = Object.entries(contagemProdutos)
      .sort((a, b) => b[1].quantidade - a[1].quantidade)
      .slice(0, 3)
      .map(([nome, dados]) => ({ nome, ...dados }))

    // Top 3 produtos mais lucrativos
    const topLucrativos = Object.entries(contagemProdutos)
      .sort((a, b) => b[1].lucro - a[1].lucro)
      .slice(0, 3)
      .map(([nome, dados]) => ({ nome, ...dados }))

    // Diferenças de fechamento
    const diferencasCaixa = fechamento.map((f) => ({
      setor: f.setor,
      vendedor: f.vendedor,
      diferenca: f.diferenca,
      status: f.diferenca === 0 ? 'exato' : f.diferenca > 0 ? 'sobra' : 'falta',
    }))

    // 3. Monta contexto executivo e envia ao Gemini
    const dataFormatada = hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const prompt = `
Você é um consultor e assistente de gestão executiva da Amigão Distribuidora de Bebidas.
Escreva um resumo diário em português, com tom profissional, claro, estratégico e direto para os sócios/administradores.
Use no máximo 4 a 5 parágrafos curtos. Não use markdown pesado, apenas texto simples com emojis pontuais para leitura rápida no WhatsApp/E-mail.

Data: ${dataFormatada}

📊 Indicadores do Dia:
- Faturamento Total: R$ ${totalGeral.toFixed(2)} (${totalPedidos} pedidos)
- Lucro Bruto Estimado: R$ ${lucroEstimado.toFixed(2)} (Margem média: ${margemMediaLucro.toFixed(1)}%)
- Balcão: R$ ${totalBalcao.toFixed(2)} (${pedidosBalcao.length} pedidos)
- Delivery: R$ ${totalDelivery.toFixed(2)} (${pedidosDelivery.length} pedidos)
- Externo: R$ ${totalExterno.toFixed(2)} (${pedidosExterno.length} pedidos)
- Top 3 Produtos Mais Vendidos: ${topProdutos.map((p) => `${p.nome} (${p.quantidade} un. - R$ ${p.total.toFixed(2)})`).join(', ') || 'Nenhum'}
- Top 3 Produtos Mais Lucrativos: ${topLucrativos.map((p) => `${p.nome} (Lucro: R$ ${p.lucro.toFixed(2)})`).join(', ') || 'Nenhum'}
- Fechamento de Caixa: ${diferencasCaixa.length === 0 ? 'Nenhum caixa fechado ainda' : diferencasCaixa.map((d) => `${d.vendedor} (${d.setor}): ${d.status} de R$ ${Math.abs(d.diferenca).toFixed(2)}`).join(', ')}

Destaque o canal com melhor performance, a saúde da margem e eventuais atenções de caixa. Escreva o resumo agora:
    `.trim()

    const resumo = await buscarIA(prompt)

    // 4. Busca admins ativos com e-mail ou WhatsApp
    const admins = await prismaCliente.usuario.findMany({
      where: { nivelAcesso: 'ADMIN', status: true },
      select: { nome: true, email: true, whatsapp: true },
    })

    if (admins.length === 0) {
      console.warn('[JOB] Nenhum admin encontrado para envio do resumo.')
      return
    }

    // 5. Envia para cada admin
    const assunto = `📊 Resumo do dia — ${hoje.toLocaleDateString('pt-BR')}`

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #ff8c00; padding: 20px 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">📊 Resumo Executivo Diário</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 14px;">${dataFormatada}</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.7; color: #333; font-size: 15px;">${resumo}</pre>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa; margin: 0;">Amigão Distribuidora de Bebidas — Sistema de Gestão Central</p>
        </div>
      </div>
    `

    for (const admin of admins) {
      if (admin.email) {
        const emailServico = new EnviarEmailServico()
        await emailServico.enviarNovoEmail(admin.email, assunto, htmlEmail)
      }
      if (admin.whatsapp) {
        await enviarWhatsApp(admin.whatsapp, `${assunto}\n\n${resumo}`)
      }
    }

    console.log('[JOB] Resumo diário processado e enviado com sucesso.')
  } catch (err) {
    console.error('[JOB] Erro no resumo diário:', err.message)
  }
}

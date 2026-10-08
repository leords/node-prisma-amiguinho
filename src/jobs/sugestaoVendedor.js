// src/jobs/sugestaoVendedor.js
import { enviarWhatsApp } from '../utilidades/whatsapp.js'
import { buscarIA } from '../utilidades/gemini.js'
import prismaCliente from '../prisma/index.js'

// Quantos dias de histórico considerar por cliente
const DIAS_HISTORICO = 60

export async function executarSugestaoVendedor() {
  console.log('[JOB] Iniciando sugestão de rota/pedidos para vendedores com IA (Gemini)...')

  const hoje = new Date()
  const inicioPeriodo = new Date(hoje)
  inicioPeriodo.setDate(hoje.getDate() - DIAS_HISTORICO)

  try {
    // 1. Busca vendedores externos ativos com WhatsApp
    const vendedores = await prismaCliente.usuario.findMany({
      where: {
        nivelAcesso: 'EXTERNO',
        status: true,
        whatsapp: { not: null },
      },
      select: { id: true, nome: true, whatsapp: true, usuario: true },
    })

    if (vendedores.length === 0) {
      console.log('[JOB] Nenhum vendedor externo ativo com WhatsApp cadastrado.')
      return
    }

    for (const vendedor of vendedores) {
      // 2. Busca clientes atribuídos a este vendedor
      const clientes = await prismaCliente.clienteExterno.findMany({
        where: { vendedor: vendedor.usuario },
        select: { id: true, nome: true, cidade: true, bairro: true },
      })

      if (clientes.length === 0) continue

      // 3. Para cada cliente, busca histórico recente de pedidos
      const dadosClientes = []

      for (const cliente of clientes) {
        const pedidos = await prismaCliente.pedidoExterno.findMany({
          where: {
            clienteId: cliente.id,
            data: { gte: inicioPeriodo, lte: hoje },
          },
          include: { itens: { include: { produto: true } } },
          orderBy: { data: 'desc' },
        })

        if (pedidos.length === 0) continue

        const ultimoPedido = pedidos[0]
        const diasDesdeUltimoPedido = Math.floor(
          (hoje.getTime() - ultimoPedido.data.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Contagem de produtos mais pedidos pelo cliente
        const contagemProdutos = {}
        pedidos.forEach((p) => {
          p.itens.forEach((item) => {
            const nome = item.produto.nome
            if (!contagemProdutos[nome]) contagemProdutos[nome] = 0
            contagemProdutos[nome] += item.quantidade
          })
        })

        const topProdutos = Object.entries(contagemProdutos)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([nome, qtd]) => `${nome} (${qtd} un.)`)

        const ticketMedio =
          pedidos.reduce((acc, p) => acc + p.total, 0) / pedidos.length

        dadosClientes.push({
          nome: cliente.nome,
          localizacao: cliente.bairro || cliente.cidade || 'Não informado',
          totalPedidos: pedidos.length,
          diasDesdeUltimoPedido,
          ticketMedio: ticketMedio.toFixed(2),
          topProdutos,
        })
      }

      if (dadosClientes.length === 0) continue

      // 4. Gera roteiro inteligente e sugestão com Gemini
      const prompt = `
Você é o assistente comercial e coordenador de vendas da Amigão Distribuidora.
O vendedor de campo ${vendedor.nome} está iniciando sua rota de visitas hoje.

Analise o histórico dos clientes abaixo e gere um roteiro prático e motivador:
1. Destaque clientes com maior urgência de reposição (ex: sem comprar há mais de 7 a 14 dias).
2. Para cada cliente chave, indique produtos essenciais que ele costuma pedir para oferecer no momento do pedido.
3. Mantenha o texto objetivo, informal, encorajador e fácil de ler no celular pelo WhatsApp (use emojis moderados e tópicos).

📋 Histórico dos Clientes:
${dadosClientes
  .map(
    (c) => `
- ${c.nome} (${c.localizacao}):
  * Último pedido há: ${c.diasDesdeUltimoPedido} dias
  * Total de compras no período: ${c.totalPedidos} pedidos (Ticket Médio: R$ ${c.ticketMedio})
  * Produtos mais comprados: ${c.topProdutos.join(', ') || 'Variados'}
`
  )
  .join('')}

Escreva a mensagem matinal agora:
      `.trim()

      const sugestao = await buscarIA(prompt)

      // 5. Envia por WhatsApp
      const mensagem = `🛵 *Bom dia, ${vendedor.nome}!* ☀️\n\nAqui estão suas sugestões estratégicas para a rota de hoje:\n\n${sugestao}`
      await enviarWhatsApp(vendedor.whatsapp, mensagem)

      console.log(`[JOB] Sugestão de rota enviada com sucesso para o vendedor: ${vendedor.nome}`)
    }

    console.log('[JOB] Processamento de sugestões para vendedores finalizado.')
  } catch (err) {
    console.error('[JOB] Erro na sugestão de vendedor:', err.message)
  }
}

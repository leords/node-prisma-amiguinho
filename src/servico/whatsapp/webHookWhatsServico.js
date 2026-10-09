// src/servico/whatsapp/webHookWhatsServico.js
import { consultaDadosIA } from '../../utilidades/gemini.js'
import { enviarWhatsApp } from '../../utilidades/whatsapp.js'
import prismaCliente from '../../prisma/index.js'

class ProcessarMensagemWhatsAppServico {
  async executar(payload) {
    try {
      if (payload?.event !== 'Message') return

      const info = payload.data?.Info || payload.data?.key
      if (!info) return

      // Ignora mensagens do próprio bot, grupos e canais
      if (info.IsFromMe || info.fromMe) return
      if (info.IsGroup || info.isGroup) return
      if (info.Chat?.endsWith('@newsletter') || info.remoteJid?.endsWith('@newsletter')) return

      // Extrai texto da mensagem
      const mensagem =
        payload.data.Message?.conversation ||
        payload.data.Message?.extendedTextMessage?.text ||
        payload.data.message?.conversation ||
        payload.data.message?.extendedTextMessage?.text

      // Prioriza JID que não seja @lid (identidade oculta do WhatsApp)
      const candidatosJid = [
        payload.data?.Info?.Sender,
        payload.data?.Info?.Chat,
        payload.data?.Info?.RemoteJid,
        payload.data?.key?.participant,
        payload.data?.key?.remoteJid,
      ].filter(Boolean)

      const numeroOrigem =
        candidatosJid.find((j) => !String(j).endsWith('@lid')) ||
        candidatosJid[0] ||
        ''

      if (!mensagem || !numeroOrigem) return

      // Remove @s.whatsapp.net e sufixos de dispositivo como :14 antes de pegar os dígitos
      const numeroFormatado = String(numeroOrigem)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')

      const nomeContato = payload.data.Info?.PushName || 'Colaborador'

      console.log(
        `[WHATSAPP INTERNO] Mensagem de ${nomeContato} (JID: ${numeroOrigem} | Número: ${numeroFormatado}): "${mensagem}"`
      )

      // 1. Identificação e Autenticação do Colaborador por Telefone
      const usuario = await this.autenticarColaborador(numeroOrigem)

      if (!usuario) {
        console.warn(
          `[WHATSAPP INTERNO] Número ${numeroFormatado} (JID: ${numeroOrigem}) não encontrado ou não autorizado.`
        )
        await enviarWhatsApp(
          numeroOrigem,
          `⛔ *Canal Interno Exclusivo — Amigão Distribuidora*\n\nOlá, ${nomeContato}! Este número é restrito para uso da equipe interna e vendedores da Amigão Distribuidora.\n\nSe você faz parte da equipe, solicite ao administrador o cadastro do seu número de WhatsApp no sistema.`
        )
        return
      }


      // 2. Roteamento Inteligente baseado no Nível de Acesso (RBAC)
      const textoLimpo = mensagem.trim().toLowerCase()

      // Ajuda / Menu de Comandos
      if (this.ehComandoMenu(textoLimpo)) {
        const menuResposta = this.gerarMenuPorPerfil(usuario)
        await enviarWhatsApp(numeroOrigem, menuResposta)
        return
      }

      // Consulta de Estoque (Permitido para todos os perfis internos)
      if (this.ehComandoEstoque(textoLimpo)) {
        const respostaEstoque = await this.processarConsultaEstoque(textoLimpo)
        await enviarWhatsApp(numeroOrigem, respostaEstoque)
        return
      }

      // Consulta de Vendas
      if (this.ehComandoVendas(textoLimpo)) {
        const respostaVendas = await this.processarConsultaVendas(usuario)
        await enviarWhatsApp(numeroOrigem, respostaVendas)
        return
      }

      // Consulta de Pendências / Vales
      if (this.ehComandoPendencias(textoLimpo)) {
        const respostaPendencias = await this.processarConsultaPendencias(usuario)
        await enviarWhatsApp(numeroOrigem, respostaPendencias)
        return
      }

      // Consulta de Clientes Inativos (Vendedores e Admin)
      if (this.ehComandoClientesInativos(textoLimpo)) {
        const respostaInativos = await this.processarClientesInativos(usuario)
        await enviarWhatsApp(numeroOrigem, respostaInativos)
        return
      }

      // Ranking de Vendedores (Apenas ADMIN)
      if (this.ehComandoRanking(textoLimpo) && usuario.nivelAcesso === 'ADMIN') {
        const respostaRanking = await this.processarRankingVendedores()
        await enviarWhatsApp(numeroOrigem, respostaRanking)
        return
      }

      // Fechamentos de Caixa (ADMIN ou BALCAO)
      if (this.ehComandoFechamentos(textoLimpo) && ['ADMIN', 'BALCAO'].includes(usuario.nivelAcesso)) {
        const respostaFechamento = await this.processarFechamentosCaixa(usuario)
        await enviarWhatsApp(numeroOrigem, respostaFechamento)
        return
      }

      // 3. Fallback: Consulta Livre com Gemini contextualizado ao perfil do usuário
      const respostaIA = await this.processarConsultaLivreIA(usuario, mensagem)
      await enviarWhatsApp(numeroOrigem, respostaIA)
    } catch (erro) {
      console.error('[WHATSAPP INTERNO] Erro ao processar webhook:', erro)
    }
  }

  /**
   * Localiza o usuário no banco de dados normalizando os dígitos do telefone.
   */
  async autenticarColaborador(numeroRecebido) {
    const digitosRecebidos = String(numeroRecebido || '')
      .split('@')[0]
      .split(':')[0]
      .replace(/\D/g, '')

    if (!digitosRecebidos || digitosRecebidos.length < 8) return null

    const usuariosAtivos = await prismaCliente.usuario.findMany({
      where: {
        status: true,
        whatsapp: { not: null },
      },
      select: {
        id: true,
        nome: true,
        usuario: true,
        whatsapp: true,
        nivelAcesso: true,
      },
    })

    const ultimos8Recebido = digitosRecebidos.slice(-8)

    console.log(
      `[WHATSAPP AUTH] Recebido: "${digitosRecebidos}" (Últimos 8: "${ultimos8Recebido}"). Usuários ativos com WhatsApp no banco (${usuariosAtivos.length}):`,
      usuariosAtivos.map((u) => `${u.nome} [${u.nivelAcesso}]: ${u.whatsapp}`)
    )


    return usuariosAtivos.find((u) => {
      const digitosUsuario = String(u.whatsapp || '')
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')

      if (!digitosUsuario || digitosUsuario.length < 8) return false

      const ultimos8Usuario = digitosUsuario.slice(-8)

      // 1. Match exato ou sufixo completo (tolerando DDI 55 ou DDD)
      if (
        digitosRecebidos === digitosUsuario ||
        digitosRecebidos.endsWith(digitosUsuario) ||
        digitosUsuario.endsWith(digitosRecebidos)
      ) {
        return true
      }

      // 2. Match pelos últimos 8 dígitos (elimina divergência de 9º dígito no WhatsApp)
      return ultimos8Recebido === ultimos8Usuario
    })
  }


  // --- Verificadores de Intenção ---
  ehComandoMenu(t) {
    return ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'ajuda', 'menu', 'comandos', 'inicio', 'início'].includes(t)
  }

  ehComandoVendas(t) {
    return t.includes('venda') || t.includes('vendi') || t.includes('faturamento') || t === '1'
  }

  ehComandoPendencias(t) {
    return t.includes('pendencia') || t.includes('pendência') || t.includes('vale') || t.includes('inadimpl') || t.includes('devedor') || t === '2'
  }

  ehComandoClientesInativos(t) {
    return t.includes('inativo') || t.includes('sumido') || t.includes('sem comprar') || t.includes('reativar') || t === '3'
  }

  ehComandoEstoque(t) {
    return t.startsWith('estoque') || t.startsWith('tem ') || t.startsWith('saldo ') || t.startsWith('preco ') || t.startsWith('preço ') || t === '4'
  }

  ehComandoRanking(t) {
    return t.includes('ranking') || t.includes('vendedores') || t.includes('equipe')
  }

  ehComandoFechamentos(t) {
    return t.includes('fechamento') || t.includes('caixa') || t.includes('diferença') || t.includes('diferenca')
  }

  // --- Gerador de Menus ---
  gerarMenuPorPerfil(usuario) {
    const hojeFormatado = new Date().toLocaleDateString('pt-BR')

    if (usuario.nivelAcesso === 'EXTERNO') {
      return `🛵 *Olá, ${usuario.nome}! (Vendedor Externo)* 👋
Hoje é ${hojeFormatado}. Como posso te ajudar na sua rota?

📊 *1. Minhas Vendas*
Envie *"vendas"* para ver seu faturamento e pedidos de hoje.

📋 *2. Vales e Pendências*
Envie *"pendencias"* para ver clientes da sua carteira com vales em aberto.

⚠️ *3. Clientes sem Comprar*
Envie *"inativos"* para ver clientes que não compram há mais de 7 dias.

📦 *4. Consulta de Estoque*
Envie *"estoque [nome]"* (ex: *estoque brahma*) para ver saldo e preços.

💡 _Ou digite qualquer pergunta sobre suas vendas ou produtos!_`
    }

    if (usuario.nivelAcesso === 'ADMIN') {
      return `👑 *Olá, ${usuario.nome}! (Painel Gerencial)* 👋
Resumo e controle da Amigão Distribuidora — ${hojeFormatado}:

📊 *1. Faturamento Global do Dia*
Envie *"vendas"* ou *"faturamento"* (visão por Balcão, Delivery e Externo).

👥 *2. Vendas por Vendedor*
Envie *"ranking"* ou *"vendedores"* para ver o faturamento de cada vendedor externo.

📋 *3. Total de Pendências*
Envie *"pendencias"* para ver o montante geral de vales em aberto.

💰 *4. Fechamentos de Caixa*
Envie *"fechamentos"* para ver o status dos caixas do dia.

📦 *5. Consulta de Estoque*
Envie *"estoque [nome]"* para verificar saldo de produtos.

💡 _Você também pode fazer perguntas executivas livres!_`
    }

    return `👋 *Olá, ${usuario.nome}! (${usuario.nivelAcesso})*
Como posso ajudar você hoje?

📊 Envie *"vendas"* para consultar as vendas de hoje.
📦 Envie *"estoque [nome]"* para consultar o estoque de produtos.`
  }

  // --- Handlers de Ações ---

  /**
   * Consulta de Vendas (Hoje)
   */
  async processarConsultaVendas(usuario) {
    const inicioDia = new Date()
    inicioDia.setHours(0, 0, 0, 0)
    const fimDia = new Date()
    fimDia.setHours(23, 59, 59, 999)

    const hojeStr = new Date().toLocaleDateString('pt-BR')

    // 🛵 Vendedor Externo: Vê estritamente as suas próprias vendas
    if (usuario.nivelAcesso === 'EXTERNO') {
      const pedidos = await prismaCliente.pedidoExterno.findMany({
        where: {
          data: { gte: inicioDia, lte: fimDia },
          OR: [
            { vendedor: usuario.usuario },
            { usuarioId: usuario.id },
          ],
        },
        include: { cliente: { select: { nome: true } } },
        orderBy: { data: 'desc' },
      })

      const totalFaturado = pedidos.reduce((acc, p) => acc + p.total, 0)
      const ticketMedio = pedidos.length > 0 ? totalFaturado / pedidos.length : 0

      if (pedidos.length === 0) {
        return `📊 *Suas Vendas de Hoje — ${hojeStr}*\n👤 Vendedor: *${usuario.nome}*\n\nNenhum pedido externo lançado até o momento. Boas vendas na rota! 🛵💪`
      }

      const ultimosPedidos = pedidos
        .slice(0, 4)
        .map((p) => `• ${p.cliente?.nome || 'Cliente'}: R$ ${p.total.toFixed(2)} (${p.status})`)
        .join('\n')

      return `📊 *Suas Vendas de Hoje — ${hojeStr}*
👤 Vendedor: *${usuario.nome}*

💰 *Total Faturado:* R$ ${totalFaturado.toFixed(2)}
📦 *Qtd. de Pedidos:* ${pedidos.length}
🎯 *Ticket Médio:* R$ ${ticketMedio.toFixed(2)}

📝 *Últimos Pedidos:*
${ultimosPedidos}`
    }

    // 👑 Admin: Visão Global Consolidada
    if (usuario.nivelAcesso === 'ADMIN') {
      const [balcao, delivery, externo] = await Promise.all([
        prismaCliente.pedidoBalcao.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          select: { total: true },
        }),
        prismaCliente.pedidoDelivery.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          select: { total: true },
        }),
        prismaCliente.pedidoExterno.findMany({
          where: { data: { gte: inicioDia, lte: fimDia } },
          select: { total: true },
        }),
      ])

      const totalBalcao = balcao.reduce((acc, p) => acc + p.total, 0)
      const totalDelivery = delivery.reduce((acc, p) => acc + p.total, 0)
      const totalExterno = externo.reduce((acc, p) => acc + p.total, 0)
      const totalGeral = totalBalcao + totalDelivery + totalExterno
      const totalPedidos = balcao.length + delivery.length + externo.length
      const ticketMedio = totalPedidos > 0 ? totalGeral / totalPedidos : 0

      return `📊 *Faturamento Geral — ${hojeStr}*
👑 Gestão Executiva Central

💰 *FATURAMENTO TOTAL: R$ ${totalGeral.toFixed(2)}*
📦 *Total de Pedidos:* ${totalPedidos}
🎯 *Ticket Médio Geral:* R$ ${ticketMedio.toFixed(2)}

🏢 *Por Setor:*
• *Balcão:* R$ ${totalBalcao.toFixed(2)} (${balcao.length} pedidos)
• *Delivery:* R$ ${totalDelivery.toFixed(2)} (${delivery.length} pedidos)
• *Externo (Rotas):* R$ ${totalExterno.toFixed(2)} (${externo.length} pedidos)`
    }

    // Outros Perfis (Balcão / Delivery)
    if (usuario.nivelAcesso === 'BALCAO') {
      const pedidos = await prismaCliente.pedidoBalcao.findMany({
        where: { data: { gte: inicioDia, lte: fimDia } },
        select: { total: true },
      })
      const total = pedidos.reduce((acc, p) => acc + p.total, 0)
      return `🏪 *Vendas Balcão Hoje — ${hojeStr}*\n💰 *Total:* R$ ${total.toFixed(2)} (${pedidos.length} pedidos)`
    }

    if (usuario.nivelAcesso === 'DELIVERY') {
      const pedidos = await prismaCliente.pedidoDelivery.findMany({
        where: { data: { gte: inicioDia, lte: fimDia } },
        select: { total: true },
      })
      const total = pedidos.reduce((acc, p) => acc + p.total, 0)
      return `🛵 *Vendas Delivery Hoje — ${hojeStr}*\n💰 *Total:* R$ ${total.toFixed(2)} (${pedidos.length} pedidos)`
    }

    return 'Consulta de vendas não disponível para este perfil.'
  }

  /**
   * Consulta de Pendências / Vales
   */
  async processarConsultaPendencias(usuario) {
    const hoje = new Date()

    // 🛵 Vendedor: Apenas clientes da sua carteira
    if (usuario.nivelAcesso === 'EXTERNO') {
      const clientes = await prismaCliente.clienteExterno.findMany({
        where: { vendedor: usuario.usuario },
        select: { id: true },
      })

      if (clientes.length === 0) {
        return `📋 *Pendências e Vales*\n👤 Vendedor: *${usuario.nome}*\n\nNenhum cliente vinculado ao seu usuário.`
      }

      const clienteIds = clientes.map((c) => c.id)

      const pendencias = await prismaCliente.pendencia.findMany({
        where: {
          clienteId: { in: clienteIds },
          status: { in: ['aberta', 'parcial'] },
        },
        include: { cliente: { select: { nome: true } } },
        orderBy: { dataVencimento: 'asc' },
      })

      if (pendencias.length === 0) {
        return `📋 *Vales e Pendências — Carteira de ${usuario.nome}*\n\n🎉 Parabéns! Não há vales em aberto na sua carteira.`
      }

      let totalAberto = 0
      let qtdVencidas = 0

      const listaFormatada = pendencias.slice(0, 6).map((p) => {
        const saldoDevido = p.valor - p.valorPago
        totalAberto += saldoDevido

        const vencida = hoje > new Date(p.dataVencimento)
        if (vencida) qtdVencidas++

        const dataVenc = new Date(p.dataVencimento).toLocaleDateString('pt-BR')
        const flag = vencida ? '🔴 VENCIDO' : '🟡 A Vencer'

        return `• *${p.cliente?.nome || 'Cliente'}*: R$ ${saldoDevido.toFixed(2)} (${flag} ${dataVenc})`
      })

      return `📋 *Vales e Pendências — Sua Carteira*
👤 Vendedor: *${usuario.nome}*

💰 *Total em Aberto:* R$ ${totalAberto.toFixed(2)}
📄 *Total de Vales:* ${pendencias.length} (${qtdVencidas} vencidos)

*Principais Cobranças:*
${listaFormatada.join('\n')}
${pendencias.length > 6 ? `\n_...e mais ${pendencias.length - 6} vale(s)._` : ''}`
    }

    // 👑 Admin: Visão Geral de Inadimplência
    if (usuario.nivelAcesso === 'ADMIN') {
      const pendencias = await prismaCliente.pendencia.findMany({
        where: { status: { in: ['aberta', 'parcial'] } },
        include: { cliente: { select: { nome: true, vendedor: true } } },
        orderBy: { dataVencimento: 'asc' },
      })

      if (pendencias.length === 0) {
        return '📋 *Controle de Pendências*\n\nNenhuma pendência ou vale em aberto na distribuidora.'
      }

      let totalGeralAberto = 0
      let totalVencido = 0

      pendencias.forEach((p) => {
        const saldo = p.valor - p.valorPago
        totalGeralAberto += saldo
        if (hoje > new Date(p.dataVencimento)) totalVencido += saldo
      })

      const top5Devedores = pendencias.slice(0, 5).map((p) => {
        const saldo = p.valor - p.valorPago
        const dataVenc = new Date(p.dataVencimento).toLocaleDateString('pt-BR')
        return `• *${p.cliente?.nome}* (Vend: ${p.cliente?.vendedor || 'N/A'}): R$ ${saldo.toFixed(2)} (Venc: ${dataVenc})`
      })

      return `📋 *Inadimplência Geral — Pendências*
👑 Gestão Financeira

💰 *Total em Aberto:* R$ ${totalGeralAberto.toFixed(2)}
🔴 *Montante Vencido:* R$ ${totalVencido.toFixed(2)}
📄 *Qtd. Total de Vales:* ${pendencias.length}

*Maiores / Mais Antigas Pendências:*
${top5Devedores.join('\n')}`
    }

    return 'Consulta de pendências não autorizada para este perfil.'
  }

  /**
   * Consulta de Clientes Inativos / Sem Compras
   */
  async processarClientesInativos(usuario) {
    const hoje = new Date()
    const seteDiasAtras = new Date(hoje)
    seteDiasAtras.setDate(hoje.getDate() - 7)

    const filtroVendedor = usuario.nivelAcesso === 'EXTERNO' ? { vendedor: usuario.usuario } : {}

    const clientes = await prismaCliente.clienteExterno.findMany({
      where: filtroVendedor,
      select: {
        id: true,
        nome: true,
        cidade: true,
        bairro: true,
        vendedor: true,
        pedidos: {
          orderBy: { data: 'desc' },
          take: 1,
          select: { data: true, total: true },
        },
      },
    })

    const inativos = clientes
      .map((c) => {
        const ultimoPedido = c.pedidos[0]
        const diasSemComprar = ultimoPedido
          ? Math.floor((hoje.getTime() - new Date(ultimoPedido.data).getTime()) / (1000 * 60 * 60 * 24))
          : 999

        return {
          nome: c.nome,
          local: c.bairro || c.cidade || 'N/A',
          vendedor: c.vendedor,
          diasSemComprar,
        }
      })
      .filter((c) => c.diasSemComprar >= 7)
      .sort((a, b) => b.diasSemComprar - a.diasSemComprar)

    if (inativos.length === 0) {
      return `⚠️ *Clientes Inativos*\n\nExcelente! Todos os seus clientes cadastrados compraram nos últimos 7 dias. 🎉`
    }

    const lista = inativos.slice(0, 6).map((c) => {
      const tempo = c.diasSemComprar >= 900 ? 'Sem histórico' : `${c.diasSemComprar} dias sem comprar`
      return `• *${c.nome}* (${c.local}): ${tempo}`
    })

    return `⚠️ *Clientes para Reativar na Rota*
${usuario.nivelAcesso === 'EXTERNO' ? `👤 Vendedor: *${usuario.nome}*` : '👑 Visão Geral'}

Encontramos *${inativos.length} cliente(s)* sem compras há mais de 7 dias:

${lista.join('\n')}
\n💡 _Dica: Aproveite para fazer uma visita ou contato de reposição hoje!_`
  }

  /**
   * Consulta Rápida de Estoque
   */
  async processarConsultaEstoque(texto) {
    const termo = texto
      .replace(/^(estoque|tem|saldo|preco|preço)\s*/i, '')
      .trim()

    if (!termo) {
      return '📦 *Consulta de Estoque*\n\nFavor informar o produto desejado. Exemplo:\n• *estoque brahma*\n• *estoque heineken*\n• *tem coca*'
    }

    const produtos = await prismaCliente.produto.findMany({
      where: {
        nome: {
          contains: termo,
          mode: 'insensitive',
        },
      },
      select: {
        nome: true,
        embalagem: true,
        estoque: true,
        precoVenda: true,
        precoUndVenda: true,
      },
      take: 6,
    })

    if (produtos.length === 0) {
      return `📦 *Consulta de Estoque*\n\nNenhum produto encontrado com o termo "*${termo}*". Tente outro nome.`
    }

    const itens = produtos.map((p) => {
      const precoCx = Number(p.precoVenda).toFixed(2)
      const precoUnd = Number(p.precoUndVenda) > 0 ? ` (R$ ${Number(p.precoUndVenda).toFixed(2)} un.)` : ''
      const embalagemStr = p.embalagem ? ` [${p.embalagem}]` : ''
      const statusEstoque = p.estoque > 0 ? `*${p.estoque}* cx/fardo` : '🔴 *SEM ESTOQUE*'

      return `• *${p.nome}*${embalagemStr}\n  Estoque: ${statusEstoque} | Preço: R$ ${precoCx} cx${precoUnd}`
    })

    return `📦 *Resultado da Consulta de Estoque:*\n\n${itens.join('\n\n')}`
  }

  /**
   * Ranking de Vendas por Vendedor (ADMIN)
   */
  async processarRankingVendedores() {
    const inicioDia = new Date()
    inicioDia.setHours(0, 0, 0, 0)
    const fimDia = new Date()
    fimDia.setHours(23, 59, 59, 999)

    const pedidosExternos = await prismaCliente.pedidoExterno.findMany({
      where: { data: { gte: inicioDia, lte: fimDia } },
      select: { vendedor: true, total: true },
    })

    if (pedidosExternos.length === 0) {
      return '👥 *Ranking de Vendas Externas de Hoje*\n\nNenhum pedido externo registrado hoje até o momento.'
    }

    const totaisPorVendedor = {}

    pedidosExternos.forEach((p) => {
      const nomeVend = p.vendedor || 'Sem Vendedor'
      if (!totaisPorVendedor[nomeVend]) {
        totaisPorVendedor[nomeVend] = { total: 0, pedidos: 0 }
      }
      totaisPorVendedor[nomeVend].total += p.total
      totaisPorVendedor[nomeVend].pedidos += 1
    })

    const ranking = Object.entries(totaisPorVendedor)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([nome, dados], index) => {
        const medalha = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🛵'
        return `${medalha} *${nome}*: R$ ${dados.total.toFixed(2)} (${dados.pedidos} pedidos)`
      })

    return `👥 *Desempenho dos Vendedores Hoje:*\n\n${ranking.join('\n')}`
  }

  /**
   * Fechamentos de Caixa (ADMIN ou BALCAO)
   */
  async processarFechamentosCaixa(usuario) {
    const inicioDia = new Date()
    inicioDia.setHours(0, 0, 0, 0)
    const fimDia = new Date()
    fimDia.setHours(23, 59, 59, 999)

    const fechamentos = await prismaCliente.fechamento.findMany({
      where: { data: { gte: inicioDia, lte: fimDia } },
    })

    if (fechamentos.length === 0) {
      return '💰 *Fechamentos de Caixa de Hoje*\n\nNenhum fechamento de caixa registrado hoje ainda.'
    }

    const lista = fechamentos.map((f) => {
      const diferenca = f.diferenca
      const statusDiff = diferenca === 0 ? '✅ Exato' : diferenca > 0 ? `🟢 Sobra R$ ${diferenca.toFixed(2)}` : `🔴 Falta R$ ${Math.abs(diferenca).toFixed(2)}`
      return `• *${f.setor.toUpperCase()}* (${f.vendedor}): Status *${f.status}* | Sistema: R$ ${f.totalSistema.toFixed(2)} | Informado: R$ ${f.totalInformado.toFixed(2)} (${statusDiff})`
    })

    return `💰 *Fechamentos de Caixa — Hoje:*\n\n${lista.join('\n')}`
  }

  /**
   * Consulta Livre Inteligente com Gemini quando não há comando direto
   */
  async processarConsultaLivreIA(usuario, pergunta) {
    const instrucao = `
Você é o assistente virtual interno da Amigão Distribuidora de Bebidas no WhatsApp.
Você está conversando com o colaborador: ${usuario.nome} (Perfil: ${usuario.nivelAcesso}).
Responda de forma extremamente objetiva, profissional, cordial e rápida em português.
Use formatação leve do WhatsApp (negrito, tópicos e emojis).
Respeite o nível de acesso do colaborador: se for EXTERNO, ele só tem acesso aos seus próprios dados de vendas e sua carteira de clientes. Se for ADMIN, ele tem acesso gerencial geral.
`

    const contexto = {
      usuario: {
        nome: usuario.nome,
        usuario: usuario.usuario,
        nivelAcesso: usuario.nivelAcesso,
      },
      dataAtual: new Date().toLocaleDateString('pt-BR'),
    }

    try {
      return await consultaDadosIA({
        instrucao,
        dados: contexto,
        pergunta,
      })
    } catch (err) {
      return `Olá, ${usuario.nome}! Não consegui processar essa pergunta no momento. Envie *"ajuda"* ou *"menu"* para ver as opções disponíveis.`
    }
  }
}

export { ProcessarMensagemWhatsAppServico, ProcessarMensagemWhatsAppServico as processarMensagemWhatsAppServico }

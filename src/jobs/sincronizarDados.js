// src/jobs/sincronizarDados.js
import { buscarProdutosAPIServico } from '../servico/produtos/buscarProdutosAPIServico.js'
import { BuscarClienteDeliveryServico } from '../servico/clienteDelivery/buscarClienteDeliveryServico.js'
import { BuscarClienteExternoServico } from '../servico/clienteExterno/buscarClienteExternoServico.js'
import { BuscarFormaPagamentoServico } from '../servico/formaPagamento/buscarFormaPagamentoServico.js'

// Sincroniza os produtos - busca realizada na planilha Sheets e salva no banco
export async function sincronizarProdutos() {
  try {
    if (!process.env.PRODUTOS) {
      console.warn('[SYNC] URL de PRODUTOS não definida no .env.')
      return
    }

    const resposta = await fetch(process.env.PRODUTOS)
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`)
    }

    const dados = await resposta.json()
    const produtos = dados?.saida

    if (Array.isArray(produtos)) {
      const servico = new buscarProdutosAPIServico()
      await servico.executar(produtos)
      console.log(`[SYNC] ${produtos.length} produtos sincronizados com sucesso.`)
    } else {
      console.warn('[SYNC] Formato inesperado na resposta de produtos:', dados)
    }
  } catch (err) {
    console.error('[SYNC] Erro ao sincronizar produtos:', err.message)
  }
}

// Sincroniza os clientes delivery - busca realizada na planilha Sheets e salva no banco
export async function sincronizarClientesDelivery() {
  try {
    if (!process.env.CLIENTES_DELIVERY) {
      console.warn('[SYNC] URL de CLIENTES_DELIVERY não definida no .env.')
      return
    }

    const resposta = await fetch(process.env.CLIENTES_DELIVERY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delivery',
      }),
    })

    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`)
    }

    const dados = await resposta.json()
    const clientes = dados?.saida

    if (Array.isArray(clientes)) {
      const servico = new BuscarClienteDeliveryServico()
      await servico.executar(clientes)
      console.log(`[SYNC] ${clientes.length} clientes delivery sincronizados com sucesso.`)
    } else {
      console.warn('[SYNC] Formato inesperado na resposta de clientes delivery:', dados)
    }
  } catch (err) {
    console.error('[SYNC] Erro ao sincronizar clientes delivery:', err.message)
  }
}

// Sincroniza os clientes externos - busca realizada na planilha Sheets e salva no banco
export async function sincronizarClientesExternos() {
  try {
    if (!process.env.CLIENTES_EXTERNO) {
      console.warn('[SYNC] URL de CLIENTES_EXTERNO não definida no .env.')
      return
    }

    const resposta = await fetch(process.env.CLIENTES_EXTERNO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'externa',
      }),
    })

    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`)
    }

    const dados = await resposta.json()
    const clientes = dados?.saida

    if (Array.isArray(clientes)) {
      const servico = new BuscarClienteExternoServico()
      await servico.executar(clientes)
      console.log(`[SYNC] ${clientes.length} clientes externos sincronizados com sucesso.`)
    } else {
      console.warn('[SYNC] Formato inesperado na resposta de clientes externos:', dados)
    }
  } catch (err) {
    console.error('[SYNC] Erro ao sincronizar clientes externos:', err.message)
  }
}

// Sincroniza as formas de pagamento - busca realizada na planilha Sheets e salva no banco
export async function sincronizarFormasPagamento() {
  try {
    if (!process.env.FORMAS_PAGAMENTO) {
      console.warn('[SYNC] URL de FORMAS_PAGAMENTO não definida no .env.')
      return
    }

    const resposta = await fetch(process.env.FORMAS_PAGAMENTO)
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`)
    }

    const dados = await resposta.json()
    const formas = dados?.saida

    if (Array.isArray(formas)) {
      const servico = new BuscarFormaPagamentoServico()
      await servico.executar(formas)
      console.log(`[SYNC] ${formas.length} formas de pagamento sincronizadas com sucesso.`)
    } else {
      console.warn('[SYNC] Formato inesperado na resposta de formas de pagamento:', dados)
    }
  } catch (err) {
    console.error('[SYNC] Erro ao sincronizar formas de pagamento:', err.message)
  }
}

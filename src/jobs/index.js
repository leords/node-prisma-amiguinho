// src/jobs/index.js
import cron from 'node-cron'
import { executarResumoDiario } from './resumoDiario.js'
import { executarAlertaPositivacao } from './alertaPositivacao.js'
import { executarSugestaoVendedor } from './sugestaoVendedor.js'
import {
  sincronizarClientesDelivery,
  sincronizarClientesExternos,
  sincronizarProdutos,
  sincronizarFormasPagamento,
} from './sincronizarDados.js'

export function iniciarJobs() {
  console.log('[JOBS] Registrando tarefas agendadas...')

  const timezoneSP = { timezone: 'America/Sao_Paulo' }

  // 1. Sincronização automática a cada 1 hora com Google Sheets
  cron.schedule(
    '0 * * * *',
    async () => {
      console.log('[CRON] Sincronizando dados do Sheets...')
      await sincronizarProdutos()
      await sincronizarClientesDelivery()
      await sincronizarClientesExternos()
      await sincronizarFormasPagamento()
    },
    timezoneSP
  )

  // 2. Resumo executivo diário — todo dia às 18:00
  cron.schedule(
    '0 18 * * *',
    async () => {
      console.log('[CRON] Disparando resumo diário (18:00)...')
      await executarResumoDiario()
    },
    timezoneSP
  )

  // 3. Alerta de positivação — todo dia às 19:00
  cron.schedule(
    '0 19 * * *',
    async () => {
      console.log('[CRON] Disparando alerta de positivação (19:00)...')
      await executarAlertaPositivacao()
    },
    timezoneSP
  )

  // 4. Sugestão para vendedores — segunda a sábado às 07:30
  cron.schedule(
    '30 7 * * 1-6',
    async () => {
      console.log('[CRON] Disparando sugestão para vendedores (07:30)...')
      await executarSugestaoVendedor()
    },
    timezoneSP
  )

  // Sincronização inicial não bloqueante ao subir o servidor
  setTimeout(async () => {
    console.log('[SYNC] Executando sincronização inicial do Sheets...')
    await sincronizarProdutos()
    await sincronizarClientesDelivery()
    await sincronizarClientesExternos()
    await sincronizarFormasPagamento()
  }, 1000)

  console.log('[JOBS] Agendamentos ativos:')
  console.log('  → Sincronização Sheets:  a cada 1 hora')
  console.log('  → Resumo diário (IA):    18:00 todos os dias')
  console.log('  → Alerta positivação (IA): 19:00 todos os dias')
  console.log('  → Roteiro vendedores (IA): 07:30 (Seg a Sáb)')
}

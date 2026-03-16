// src/jobs/index.js
import cron from "node-cron";
import { executarResumoDiario } from "./resumoDiario.js";
import { executarAlertaPositivacao } from "./alertaPositivacao.js";
import { executarSugestaoVendedor } from "./sugestaoVendedor.js";


// --- TESTE DIRETO ---

//await executarResumoDiario();
//await executarAlertaPositivacao();
//await executarSugestaoVendedor();

export function iniciarJobs() {
  console.log("[JOBS] Registrando jobs...");

  

  // Resumo diário — todo dia às 18:00
  cron.schedule("0 18 * * *", async () => {
    console.log("[CRON] Disparando resumo diário (18h)");
    await executarResumoDiario();
  }, { timezone: "America/Sao_Paulo" });

  // Alerta de positivação — todo dia às 19:00
  cron.schedule("0 19 * * *", async () => {
    console.log("[CRON] Disparando alerta de positivação (19h)");
    await executarAlertaPositivacao();
  }, { timezone: "America/Sao_Paulo" });

  // Sugestão para vendedores — todo dia às 07:30
  cron.schedule("30 7 * * 1-6", async () => {
    // 1-6 = segunda a sábado (sem domingo)
    console.log("[CRON] Disparando sugestão de vendedores (07:30)");
    await executarSugestaoVendedor();
  }, { timezone: "America/Sao_Paulo" });

  console.log("[JOBS] Jobs registrados:");
  console.log("  → Resumo diário:         18:00 todos os dias");
  console.log("  → Alerta positivação:    19:00 todos os dias");
  console.log("  → Sugestão vendedores:   07:30 seg a sáb");
}
// src/services/whatsapp.js

const EVOLUTION_URL      = process.env.EVOLUTION_API_URL;      // ex: http://localhost:8080
const EVOLUTION_KEY      = process.env.EVOLUTION_API_KEY;      // API key global da Evolution
const EVOLUTION_INSTANCIA = process.env.EVOLUTION_INSTANCIA;   // nome da instância criada

/**
 * Envia uma mensagem de texto via Evolution API.
 * @param {string} numero - ex: "5511999999999" (com DDI, sem símbolos)
 * @param {string} mensagem
 */
export async function enviarWhatsApp(numero, mensagem) {
  try {
    const res = await fetch(
      `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCIA}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_KEY,
        },
        body: JSON.stringify({
          number: numero,
          text: mensagem,
        }),
      }
    );

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro);
    }

    console.log(`[WHATSAPP] Enviado para: ${numero}`);
  } catch (err) {
    console.error("[WHATSAPP] Erro ao enviar:", err.message);
  }
}
// src/utilidades/whatsapp.js

/**
 * Envia uma mensagem de texto via Evolution API / Evolution Go.
 * @param {string} numero - ex: "5511999999999" ou "5511999999999@s.whatsapp.net"
 * @param {string} mensagem - Texto da mensagem
 */
export async function enviarWhatsApp(numero, mensagem) {
  const evolutionUrl =
    process.env.EVOLUTION_API_URL ||
    process.env.EVOLUTION_URL ||
    'http://localhost:4001'

  const evolutionKey =
    process.env.EVOLUTION_API_KEY ||
    process.env.EVOLUTION_KEY ||
    'd2f6c5ae-7d06-4b78-86d3-5407479f3fd3'

  const evolutionInstancia =
    process.env.EVOLUTION_INSTANCIA || 'd2f6c5ae-7d06-4b78-86d3-5407479f3fd3'

  // Remove caracteres não numéricos caso venha com formatação ou sufixo @s.whatsapp.net
  const numeroLimpo = String(numero || '').replace(/\D/g, '')

  if (!numeroLimpo || !mensagem) {
    console.warn('[WHATSAPP] Número ou mensagem ausente para envio.')
    return
  }

  // Remove barra final da URL se houver
  const urlBase = evolutionUrl.replace(/\/+$/, '')
  const urlEnvio = `${urlBase}/send/text`

  try {
    const res = await fetch(urlEnvio, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: evolutionKey,
        token: evolutionKey,
      },
      body: JSON.stringify({
        number: numeroLimpo,
        text: mensagem,
      }),
    })

    if (!res.ok) {
      const erroTexto = await res.text()
      throw new Error(`HTTP ${res.status} - ${erroTexto}`)
    }

    console.log(`[WHATSAPP] Mensagem enviada com sucesso para: ${numeroLimpo}`)
  } catch (err) {
    console.error(`[WHATSAPP] Erro ao enviar para ${urlEnvio} (${numeroLimpo}):`, {
      mensagem: err.message,
      causa: err.cause?.message || err.cause || 'Falha de conexão / URL inacessível',
    })
  }
}
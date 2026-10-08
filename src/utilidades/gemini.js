// src/utilidades/gemini.js

const MODELOS_GEMINI = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
]

/**
 * Envia uma mensagem de texto simples para a API do Google Gemini com fallback automático de modelos.
 * @param {string} mensagem - Texto ou prompt a ser enviado.
 * @returns {Promise<string>} Resposta gerada pela IA.
 */
export const buscarIA = async (mensagem) => {
  const chaveApiKey = process.env.GEMINI_API_KEY

  if (!chaveApiKey) {
    throw new Error('Chave GEMINI_API_KEY não configurada no ambiente.')
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: mensagem }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  }

  for (const modelo of MODELOS_GEMINI) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${chaveApiKey}`

      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const dados = await resposta.json()

      if (resposta.ok && dados.candidates?.[0]?.content?.parts?.[0]?.text) {
        return dados.candidates[0].content.parts[0].text
      }

      console.warn(
        `[GEMINI] Modelo ${modelo} retornou erro:`,
        dados.error?.message || 'Resposta vazia'
      )
    } catch (erro) {
      console.warn(`[GEMINI] Falha ao comunicar com modelo ${modelo}:`, erro.message)
    }
  }

  throw new Error('Todos os modelos do Gemini falharam na requisição.')
}

/**
 * Consulta a IA com instrução de sistema (papel) e dados de contexto serializados.
 * @param {Object} params
 * @param {string} params.instrucao - Instrução de comportamento do assistente (system prompt).
 * @param {any} [params.dados] - Objeto/Array ou dados de contexto a serem analisados.
 * @param {string} params.pergunta - Pergunta ou comando do usuário.
 * @returns {Promise<string>} Resposta textual gerada pela IA.
 */
export const consultaDadosIA = async ({ instrucao, dados = null, pergunta }) => {
  const chaveApiKey = process.env.GEMINI_API_KEY

  if (!chaveApiKey) {
    throw new Error('Chave GEMINI_API_KEY não configurada no ambiente.')
  }

  const contexto = dados
    ? JSON.stringify(dados, null, 2)
    : 'Nenhum dado adicional fornecido.'

  const payload = {
    systemInstruction: {
      parts: [{ text: instrucao }],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `DADOS DO SISTEMA:\n${contexto}\n\nSOLICITAÇÃO / PERGUNTA:\n${pergunta}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  }

  for (const modelo of MODELOS_GEMINI) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${chaveApiKey}`

      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const dadosResposta = await resposta.json()

      if (resposta.ok && dadosResposta.candidates?.[0]?.content?.parts?.[0]?.text) {
        return dadosResposta.candidates[0].content.parts[0].text
      }

      console.warn(
        `[GEMINI] Modelo ${modelo} retornou erro:`,
        dadosResposta.error?.message || 'Resposta vazia'
      )
    } catch (erro) {
      console.warn(`[GEMINI] Falha ao comunicar com modelo ${modelo}:`, erro.message)
    }
  }

  throw new Error('Todos os modelos do Gemini falharam na requisição.')
}



// src/services/groq.js
import Groq from "groq-sdk";
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
 
/**
 * Envia um prompt para o Groq e retorna o texto gerado.
 * @param {string} prompt
 * @param {string} model - padrão: llama3-8b-8192
 * @returns {Promise<string>}
 */
export async function gerarTextoGroq(prompt, model = "llama-3.3-70b-versatile") {
  const resposta = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1024,
    temperature: 0.7,
  });
 
  return resposta.choices[0]?.message?.content?.trim() ?? "";
}
 
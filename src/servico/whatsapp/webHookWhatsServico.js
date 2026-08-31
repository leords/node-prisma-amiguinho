import { buscarIA } from "../../utilidades/openRouter.js";
import { enviarWhatsApp } from "../../utilidades/whatsapp.js";

class processarMensagemWhatsAppServico {
    async executar(payload) {

        const mensagem = payload.data.Message?.conversation;
        const numero = payload.data.Info?.Chat ? payload.data.Info?.Chat : ''
        const nome = payload.data.Info.PushName;
        const info = payload.data?.Info;
        

        if (payload.event !== "Message") {
            return;
        }

        if (!info) {
            return;
        }

        // Ignora mensagens do próprio bot
        if (info.IsFromMe) {
            return;
        }

        // Ignora grupos
        if (info.IsGroup) {
            return;
        }

        // Ignora newsletters
        if (info.Chat?.endsWith("@newsletter")) {
            return;
        }

        // Somente texto
        if (info.Type !== "text") {
            return;
        }


        if (!mensagem || !numero) {
            console.log("[WHATSAPP] Mensagem sem texto ou número.");
            return;
        }

        const numeroFormatado = numero.split("@")[0];

        console.log("[WHATSAPP] Mensagem recebida:");
        console.log("Nome:", nome);
        console.log("Número:", numeroFormatado); 
        console.log("Mensagem:", mensagem);

        if (mensagem.toLowerCase() === "oi") {

            await enviarWhatsApp(
            numero,
            `Olá, bom dia! 👋

${nome}, seja bem-vindo ao Suporte Amiguinho.

Como posso ajudar?
    1️⃣ O que é uma IA e como ela funciona
    2️⃣ Versiculo do dia
    3️⃣ O que é RAG e Embdeddings`
);

            return;
        }

        if (mensagem.toLowerCase() === "1") {

            const dados = await buscarIA('Explique claramento o que é uma IA e como ela funciona em poucas palavras')
            console.log('retorno de API IA:', dados)
            await enviarWhatsApp(
                numero,
                dados
            )
        }

        if (mensagem.toLowerCase() === "2") {

            const dados = await buscarIA('Qual é o versiculo para o dia de hoje?')
            await enviarWhatsApp(
                numero,
                dados
            )
        }

        if (mensagem.toLowerCase() === "3") {
            const dados = await buscarIA('Explique de forma rápida o que é uma RAG e Embeddings')
            await enviarWhatsApp(
                numero,
                dados
            )
        }

    }
}

export { processarMensagemWhatsAppServico }

const modelos = [
    "nvidia/nemotron-3-ultra-550b-a55b:free",
    "poolside/laguna-s-2.1:free",
    "google/gemma-4-26b-a4b-it:free",
];


export const buscarIA = async (mensagem) => {

    const openRouter = process.env.OPENROUTER_API_KEY;

        // criando a messages.
        const messages = [
            {
                role: "user",
                content: mensagem
            }
        ];


    // percorrendo os modelos disponiveis conforme o retorno, caso 1 falhe, passa para outro.
    for (const modelo of modelos) {
        try {
            console.log(`Tentando modelo: ${modelo}`);

            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions", 
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${openRouter}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: modelo,
                        messages: messages,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                return data.choices[0].message.content;  //obs: choices = a api possiveis respostas dentro de choices, [0] = 1º de choices, objeto: message, content= props de message
            }

            console.log(
                `Modelo ${modelo} falhou:`,
                data.error?.message
            );

            // tenta o próximo
            continue;

        } catch (erro) {
            console.log(`Erro no modelo ${modelo}:`, erro);

            // tenta o próximo
            continue;
        }
    }

    throw new Error("Todos os modelos de IA falharam.");
    
}

// instrução = você é um gerente de vendas, dados: retorno de uma busca da sua api objeto/array JS para json, rpergunta: quanto vendedor 1 vendeu hoje 17/08/2026?
export const consultaDadosIA = async ({ instrucao, dados = null, pergunta }) => {
    const openRouter = process.env.OPENROUTER_API_KEY;


        // validando o valor de dados
        const contexto = dados
        ? JSON.stringify(dados, null, 2)  //obs: null = não quero fazer nenhuma transformação nos dados, 2 = quero identar o json com dois espaços.
        : "Nenhum dado foi fornecido.";

        // criando a messages.
        const messages = [
            {
                role: "system",
                content: instrucao
            },
            {
                role: "user",
                content: `
                    DADOS:
                    ${contexto}

                    PERGUNTA:
                    ${pergunta}
                                `
            }
        ];


    // percorrendo os modelos disponiveis conforme o retorno, caso 1 falhe, passa para outro.
    for (const modelo of modelos) {
        try {
            console.log(`Tentando modelo: ${modelo}`);

            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions", 
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${openRouter}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: modelo,
                        messages: messages,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                return data.choices[0].message.content;  //obs: choices = a api possiveis respostas dentro de choices, [0] = 1º de choices, objeto: message, content= props de message
            }

            console.log(
                `Modelo ${modelo} falhou:`,
                data.error?.message
            );

            // tenta o próximo
            continue;

        } catch (erro) {
            console.log(`Erro no modelo ${modelo}:`, erro);

            // tenta o próximo
            continue;
        }
    }

    throw new Error("Todos os modelos de IA falharam.");
}




import prismaCliente from "../../prisma/index.js"

class alterarCaixaServico {
    async executar(valor) {

        try {
            const resultado = await prismaCliente.caixa.upsert({
                where: {id: 1},
                update: {valor},
                create: {
                    id: 1,
                    valor: 200
                }
            });

            return resultado

            console.log("✔ Inicio de caixa criado com sucesso")

        } catch (error) {
            console.log("Erro ao verificar/criar inicio de caixa", error)
            
        }
    }
}


export { alterarCaixaServico }
import prismaCliente from "../../prisma/index.js"

class alterarTaxaEntregaServico {
    async executar(valor) {

        try {
            const resultado = await prismaCliente.taxaEntregaDelivery.upsert({
                where: {id: 1},
                update: {valor},
                create: {
                    id: 1,
                    valor: 5
                }
            });

            return resultado

            console.log("✔ Taxa de entrega iniciada com sucesso")

        } catch (error) {
            console.log("Erro ao verificar/criar taxa de entrega", error)
            
        }
    }
}


export { alterarTaxaEntregaServico }
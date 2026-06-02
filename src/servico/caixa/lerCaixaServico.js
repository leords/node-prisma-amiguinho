import prismaCliente from "../../prisma"

class lerCaixaServico {
    async executar() {
        try {
            return await prismaCliente.caixa.findUnique({
                where: {
                    id: 1
                }
            });

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export { lerCaixaServico }
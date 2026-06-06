import prismaCliente from "../../prisma/index.js"

class lerTaxaEntregaServico {
    async executar() {
        try {
            return await prismaCliente.taxaEntregaDelivery.findUnique({
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

export { lerTaxaEntregaServico }
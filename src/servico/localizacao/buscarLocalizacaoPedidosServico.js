import prismaCliente from "../../prisma/index.js"

class buscarLocalizacaoPedidosServico {
    async executar(inicio, fim, clienteId, usuarioId) {

        const resultado = await prismaCliente.localizacao.findMany({
            where: {
                data: {
                    gte: inicio,
                    lte: fim, 
                },
                clienteId,
                usuarioId
            }
        })

        return resultado
    }
}

export { buscarLocalizacaoPedidosServico }
import prismaCliente from "../../prisma/index.js"

class CriarFechamentoServico {

    async executar(vendedor, setor) {

        // transformando a data em string e pegando apenas a data
        const dia = new Date().toISOString().split('T')[0]

        try {
            const resultado = await prismaCliente.fechamento.upsert({
                where: {
                    vendedor_dia_setor: {
                        vendedor,
                        dia,
                        setor
                    },
                },
                update: {},
                create: {
                    vendedor,
                    dia,
                    setor
                }
            })

            return resultado
        }
        catch (error) {
            console.log(error)
            throw error
        } 
    }
}


export { CriarFechamentoServico }
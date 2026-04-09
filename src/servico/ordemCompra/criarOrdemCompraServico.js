import prismaCliente from "../../prisma/index.js"

class CriarOrdemCompraServico {
    async executar(usuarioId, fornecedorId, itens) {
    
    try {
            
        // total calculado automaticamente
        const total = itens.reduce((acc, item) => {
        return acc + item.quantidade * item.precoCompra
        }, 0)


        const pedido = await prismaCliente.ordemCompra.create({
            data: {
                usuarioId,
                fornecedorId,
                total, 
                itens: {
                    createMany: {
                        data: itens.map((item) => ({
                            produtoId: item.produtoId,
                            valorUnit: item.valorUnit,
                            quantidade: item.quantidade,
                            valorTotal: item.valorUnit * item.quantidade
                        }))
                    } 
                }
            },
            include: {
                usuario: {
                    select: {
                        nome: true
                    }
                },
                fornecedor: true,
                itens: true
            }
        })

        return pedido

        } catch (error) {
           console.log(error) 
           throw error
        }
    } 
}

export { CriarOrdemCompraServico }
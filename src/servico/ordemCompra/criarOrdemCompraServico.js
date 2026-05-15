import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class criarOrdemCompraServico {
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
                    create: itens.map((item) => ({
                        produtoId: item.produtoId,
                        valorUnit: item.valorUnit,
                        quantidade: item.quantidade,
                        valorTotal: item.valorUnit * item.quantidade
                    })) 
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

        if(!pedido) {
            throw new AppError(
                "Não foi possivel criar a ordem de compra",
                HTTP_STATUS_CODES.BAD_REQUEST,
                "ERRO_CRIAR_ORDEM_COMPRA"
            )
        }

        return pedido

        } catch (error) {
           console.log(error) 
           throw error
        }
    } 
}

export { criarOrdemCompraServico }
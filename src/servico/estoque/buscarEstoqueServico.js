import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import prismaCliente from "../../prisma/index.js"

class BuscarEstoqueServico {
    async executar(produtoId) {
        const produtos = await prismaCliente.produto.findMany({
            where: {
                produtoId: produtoId,
                estoque: {
                    gt: 0
                },
                
            },
            select: {
                id: true,
                nome: true,
                estoque: true
            },
            orderBy: {
                nome: 'asc'
            }
        });

        if(!produtos) {
            throw new AppError(
                "Estoque não encontrado",
                HTTP_STATUS_CODES.BAD_REQUEST,
                "TIPO_PRODUTO_BAD_REQUEST"
            )
        }

        console.log(produtos)


        return produtos
    }
}

export { BuscarEstoqueServico }

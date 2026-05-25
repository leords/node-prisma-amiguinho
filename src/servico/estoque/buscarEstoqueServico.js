import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import prismaCliente from "../../prisma/index.js"

class BuscarEstoqueServico {
    async executar(produtoId) {
        const produtos = await prismaCliente.produto.findMany({
            where: {
                produtoId: produtoId,
                
            },
            select: {
                id: true,
                nome: true,
                estoque: true,
                quantidade: true
            },
            orderBy: {
                estoque: 'desc'
            }
        });

        if(!produtos) {
            throw new AppError(
                "Estoque não encontrado",
                HTTP_STATUS_CODES.BAD_REQUEST,
                "TIPO_PRODUTO_BAD_REQUEST"
            )
        }

        return produtos
    }
}

export { BuscarEstoqueServico }

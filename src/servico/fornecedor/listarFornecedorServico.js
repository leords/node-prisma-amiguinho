import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import prismaCliente from "../../prisma/index.js"
import { AppError } from "../../error/appError.js"

class ListarFornecedorServico {
    async executar() {
        const fornecedores = await prismaCliente.fornecedor.findMany({
            orderBy: {
                nome: 'asc'
            }
        })

        if(!fornecedores) {
            throw new AppError(
                "Fornecedores não encontrados",
                HTTP_STATUS_CODES.NOT_FOUND,
                "FORNECEDORES_NOT_FOUND"
            )
        }

        return fornecedores
    }
}

export { ListarFornecedorServico
}
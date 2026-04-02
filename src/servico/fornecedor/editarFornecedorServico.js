import { AppError } from "../../error/appError.js"
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import prismaCliente from "../../prisma/index.js"


class EditarFornecedorServico {
    async executar (id) {

        const fornecedor = await prismaCliente.fornecedor.findFirst({
            where: {
                id
            }
        })

        if(!fornecedor) { 
            throw new AppError (
                "Fornecedor não encontrado",
                HTTP_STATUS_CODES.NOT_FOUND,
                "FORNECEDOR_NOT_FOUND"
            )
        }

        return await prismaCliente.fornecedor.update({
            where: { id },
            data: {
                status: fornecedor.status === "ATIVO" ? "INATIVO" : "ATIVO"
            }
        })

    }
}

export { EditarFornecedorServico }
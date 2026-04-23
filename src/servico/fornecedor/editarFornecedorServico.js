import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import { AppError } from "../../error/appError.js";
import prismaCliente from "../../prisma/index.js"

class EditarFornecedorServico {
    async executar (id, vendedor, telefone) {

        
        const validarFornecedor = await prismaCliente.fornecedor.findFirst({
            where: { id }
        });

        if(!validarFornecedor) {
            throw new AppError(
                "Fornecedor não encontrado",
                HTTP_STATUS_CODES.NOT_FOUND,
                "FORNECEDOR_NOT_FOUND"
            )
        }


        return await prismaCliente.fornecedor.update({
            where: {
                id
            },
            data: {
                vendedor: vendedor,
                telefone: telefone
            }
        })

    }
}

export { EditarFornecedorServico }
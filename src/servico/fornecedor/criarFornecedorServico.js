import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class CriarFornecedorServico { 
    async executar (nome, cnpj) {

        const fornecedor = await prismaCliente.fornecedor.findFirst({
            where: {
                cnpj
            }
        })

        if(fornecedor) {
            throw new AppError (
                "Já existe fornecedor cadastrado com este CNPJ",
                HTTP_STATUS_CODES.NOT_FOUND,
                "FORNECEDOR_NOT_FOUND"
            )
        }

        await prismaCliente.fornecedor.create({ 
            data: {
                nome,
                cnpj
            }
        })

        return 'Cadastro realizado com sucesso'
    }
}

export { CriarFornecedorServico }
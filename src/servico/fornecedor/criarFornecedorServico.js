import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class CriarFornecedorServico { 
    async executar (nome, cnpj, telefone, vendedor) {

        const fornecedor = await prismaCliente.fornecedor.findFirst({
            where: {
                cnpj
            }
        })

        if(fornecedor) {
            throw new AppError (
                "Já existe fornecedor cadastrado com este CNPJ",
                HTTP_STATUS_CODES.NOT_FOUND,
                "FORNECEDOR_BAD_REQUEST"
            )
        }

        const telefoneValido = await prismaCliente.fornecedor.findFirst({
            where: {
                telefone
            }
        })

        if(telefoneValido) {
            throw new AppError (
                "Já existe fornecedor cadastro com este Telefone",
                HTTP_STATUS_CODES.NOT_FOUND,
                "TELEFONE_BAD_REQUEST"
            )
        }

        await prismaCliente.fornecedor.create({ 
            data: {
                nome,
                cnpj,
                telefone,
                vendedor
            }
        })

        return 'Cadastro realizado com sucesso'
    }
}

export { CriarFornecedorServico }
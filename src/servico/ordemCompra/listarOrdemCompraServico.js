import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class ListarOrdemCompraServico {
    async executar(id, usuarioId, fornecedorId, status, inicio, fim) {

        try {
            // valida a existencia de usuarioID antes de buscar no banco
            if(usuarioId) {
                const validarUsuario = await prismaCliente.usuario.findUnique ({
                    where: {
                        id: usuarioId
                    }
                })

                if(!validarUsuario) {
                    throw new AppError(
                        "Usuário não existe",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "USUARIO_NOT_FOUND"
                    )
                }
            }

            // valida a existencia de fornecedorId antes de buscar no banco
            if(fornecedorId) {
                const validarFornecedor = await prismaCliente.fornecedor.findUnique ({
                    where: {
                        id: fornecedorId
                    }
                })

                if(!validarFornecedor) {
                    throw new AppError(
                        "Fornecedor não existe",
                        HTTP_STATUS_CODES.NOT_FOUND,
                        "FORNECEDOR_NOT_FOUND"
                    )
                }
            }


            const retorno = await prismaCliente.ordemCompra.findMany({
                where: {
                    id: id,
                    usuarioId: usuarioId,
                    fornecedorId: fornecedorId,
                    status: status,
                    data: {
                        gte: inicio,
                        lte: fim
                    }
                },
                include: {
                    itens: true,
                    fornecedor: {
                        select: {
                            nome: true
                        }
                    },
                    usuario: {
                        select: {
                            nome: true
                        }
                    }
                }
            })

            if(!retorno) {
                throw new AppError(
                    "Não encontramos ordem de compra para estes filtros",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "RETORNO_NOT_FOUND"
                )
            }

            return retorno
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export { ListarOrdemCompraServico }
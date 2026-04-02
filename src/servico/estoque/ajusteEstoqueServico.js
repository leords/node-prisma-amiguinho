import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"

class AjusteEstoqueServico {
    async executar(produtoId, quantidade, usuarioId, tipo) {

        return prismaCliente.$transaction(async (prisma) => {

            // validando produto
            const produto = await prisma.produto.findUnique({
                where: {
                    id: produtoId
                }
            })
            if(!produto) {
                throw new AppError(
                    "Produto não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "PRODUTO_NO_FOUND"
                )
            }

            if(tipo === 'SAIDA' && produto.estoque < quantidade) {
                throw new AppError(
                    "Estoque insuficiente",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ESTOQUE_INSUCIENTE"
                )
            }

            // validando usuario
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioId
                }
            })
            if(!usuario) {
                throw new AppError(
                    "Cliente não encontrado",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "CLIENTE_NOT_FOUND"
                )
            } 

            // cria estoque
            await prisma.estoque.create({
                data: {
                    produtoId: produtoId,
                    quantidade: quantidade,
                    tipo: tipo,
                    origem: "AJUSTE",
                    origemId: usuarioId,
                    usuarioId: usuarioId
                }
            });

            const operacao = tipo === "ENTRADA" ? { increment: quantidade } : { decrement: quantidade }

            await prisma.produto.update ({
                where: {
                    id: produtoId
                },
                data: { 
                    estoque: operacao
                }
            })


            return {
                sucesso: true,
                mensagem: `Ajuste de ${tipo} do estoque realizado com sucesso`
            }

        })
    }
}

export { AjusteEstoqueServico }
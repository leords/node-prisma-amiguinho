import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import prismaCliente from "../../prisma/index.js"
import { EntradaEstoqueServico } from "../estoque/entrada/entradaEstoqueServico.js"


class EditarOrdemCompraServico {
    async executar(id, status, usuarioId) {
        //opções de status: 'Realizada', 'Cancelada', 'Finalizada', 'Pendente'

        try {
            // Buscar ordem
            const validaOrdem = await prismaCliente.ordemCompra.findUnique({
                where: {
                    id: id
                },
                include: {
                    itens: true
                }
            })
            // Valida existencia da ordem
            if(!validaOrdem) {
                throw new AppError(
                    "Ordem de compra não encontrada",
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "ORDEM_COMPRA_NOT_FOUND"
                )
            }
            // Valida se a operação é redundante
            if(validaOrdem.status === status) {
                throw new AppError(
                    `O status já está como: ${status}`,
                    HTTP_STATUS_CODES.NOT_FOUND,
                    "ALTERACAO_STATUS_NOT_FOUND"
                )
            }

            // Não permite que uma ordem Em Pendente sejá cancelada? 
            if(status === 'Cancelada' && validaOrdem.status === 'Pendente') {
                throw new AppError(
                    "Não é possivel cancelar uma ordem em andamento, Reabra primeiro.",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FINALIZAR_INVALIDO"
                )
            }

            // Não permite que uma ordem finalizada seja cancelada
            if(status === 'Cancelada' && validaOrdem.status === 'Finalizada') {
                throw new AppError(
                    "Não é possível cancelar uma ordem finalizada. Reabra primeiro.",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "CANCELAMENTO_INVALIDO"
                )
            }

            // Não permite que uma ordem finalizada seja cancelada
            if(status === 'Pendente' && validaOrdem.status === 'Finalizada') {
                throw new AppError(
                    "Não é possível colocar em andamento uma ordem já finalizada. Reabra primeiro.",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "EM_ANDAMENTO_INVALIDO"
                )
            }

            // Finaliza a ordem e dá entrada no estoque!
            if(status === 'Finalizada' && validaOrdem.status !== 'Cancelada') {

                return await prismaCliente.$transaction(async (prisma) => {
                
                    await prisma.ordemCompra.update({
                        where: {
                            id: id
                        },
                        data: {
                            status: status
                        }
                    })

                    const servico = new EntradaEstoqueServico()
                    await servico.executar(validaOrdem, prisma) // passar o transaction aqui!!!

                    // valida à ação
                    const ordemAtualizada = await prisma.ordemCompra.findUnique({
                        where: { id },
                        include: {
                        itens: true,
                        fornecedor: true,
                        usuario: { select: { nome: true } }
                        }
                    })

                    return ordemAtualizada

                }) 
            }

            // Alterando a ordem para Realizada, assim revertendo o estoque.
            if( status === 'Realizada' && validaOrdem.status === 'Finalizada') {

                return await prismaCliente.$transaction( async (prisma) => {

                    // Altero o status para 'Realizada'
                    await prisma.ordemCompra.update({
                        where: {
                            id: validaOrdem.id
                        },
                        data: {
                            status: status
                        }
                    })

                    // Percorre os itens de validaOrdem e faz a reversão de estoque 
                    for (const item of validaOrdem.itens) {

                        // Reversão dos produtos
                        await prisma.produto.update({
                            where: { id: item.produtoId },
                            data: {
                                estoque: {
                                decrement: item.quantidade
                                }
                            }
                        }); 

                        // Criando o historico de estoque da reversão
                        await prisma.estoque.create({
                            data: {
                                produtoId: item.produtoId,
                                quantidade: -item.quantidade,
                                tipo: 'SAIDA',
                                origem: "REVERSAO_ORDEM",
                                origemId: validaOrdem.id,
                                usuarioId: usuarioId
                            }
                        });
                    }

                    // Retorno para a chamada do front
                    const ordemAtualizada = await prisma.ordemCompra.findUnique({
                        where: { 
                            id: validaOrdem.id
                        },
                        include: {
                        itens: true,
                        fornecedor: true,
                        usuario: { select: { nome: true } }
                        }
                    })

                    return ordemAtualizada
                })

            }

            // Caso não caia em nenhuma validação
            await prismaCliente.ordemCompra.update({
                where: {
                    id: id
                },
                data: {
                    status: status
                }
            })

            // Retorno para a chamada do front
            const ordemAtualizada = await prismaCliente.ordemCompra.findUnique({
                where: { 
                    id: validaOrdem.id
                    },
                include: {
                itens: true,
                fornecedor: true,
                usuario: { select: { nome: true } }
                }
            })

            return ordemAtualizada


        } catch (error) {
            throw error
        }

    }
}

export { EditarOrdemCompraServico }
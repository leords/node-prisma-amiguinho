import prismaCliente from "../../prisma/index.js"
import { SaidaEstoqueServico } from "../estoque/saida/saidaEstoqueServico.js";

class criarPedidoExternoServico {
    async executar(listaPedidos) {

        try {

            // coletando os uuid dos pedidos enviado via REQ
            const uuids = listaPedidos.map((pedido) => pedido.uuid);

            // buscando os pedidos que já existem no banco com o uuid passado
            const pedidosExistentes = await prismaCliente.pedidoExterno.findMany({
                where: {
                    uuid: {
                        in: uuids
                    }
                },
                select: {
                    uuid: true
                }
            });

            // Transformando os uuids em um Set.
            // new Set = cria um array de valores únicos eliminando automaticamente o duplicado.
            const uuidExistentes = new Set(
                pedidosExistentes.map((pedido) => pedido.uuid)
            )

            // Filtrando pedidos diferentes da uuidExistentes
            // .has = verifica se existe
            const pedidosValidos = listaPedidos.filter(
                (pedido) => !uuidExistentes.has(pedido.uuid)
            );

            // Força uma conexão com o bancoantes do transaction.
            await prismaCliente.$queryRaw`SELECT 1`;

            // instanciando o SaidaEstoque fora do for.
            const estoqueServico = new SaidaEstoqueServico()

            const pedidosCriados = [];

            await prismaCliente.$transaction(async (prisma) => {

                for (const pedido of pedidosValidos) { 

                    const totalPedido = pedido.itens.reduce((acc, item) => {
                        return acc +
                            Number(item.quantidade) *
                            Number(item.valorUnit);
                    }, 0);
                                    
                    const pedidoEnviado = await prisma.pedidoExterno.create({
                        data: {
                            uuid: pedido.uuid,
                            tipo: 'externo',
                            clienteId: Number(pedido.clienteId),
                            formaPagamentoId: Number(pedido.formaPagamentoId),
                            vendedor: pedido.vendedor,
                            total: Number(totalPedido),
                            data: new Date(pedido.data),
                            usuarioId: pedido.usuarioId,
                            itens: {
                                createMany: {
                                    data: pedido.itens.map((item) => ({
                                        produtoId: item.produtoId,
                                        quantidade: item.quantidade,
                                        valorUnit: item.valorUnit,
                                        valorTotal: item.valorUnit * item.quantidade,
                                    })),
                                },
                            },
                        }
                    })

                    // Preciso retornar aqui o return e passar ele ali em baixo nos enviados.  
                    await estoqueServico.executar(
                        pedidoEnviado.id, 
                        "externo", 
                        prisma
                    );

                    pedidosCriados.push({
                        clienteId: pedidoEnviado.clienteId,
                        uuid: pedidoEnviado.uuid
                    });
                 }
            });

            return {
                enviados: pedidosCriados,
            };

        } catch (error) {
            console.log(error)
            throw error
        }

    }
}


export { criarPedidoExternoServico }
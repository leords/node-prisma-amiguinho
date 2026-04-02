import { ERRO_MSG_PEDIDOS } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'
import { SaidaEstoqueServico } from '../estoque/saida/saidaEstoqueServico.js'

class CriarPedidoServico {
  async executar(setor, dados) {
    try {
      // total calculado automaticamente
      const total = dados.itens.reduce((acc, item) => {
        return acc + item.quantidade * item.valorUnit
      }, 0)


      if (setor === 'delivery') {
        await prismaCliente.$transaction(async (prisma) => { 
          const pedido = await prisma.pedidoDelivery.create({
            data: {
              clienteId: dados.clienteId,
              formaPagamentoId: dados.formaPagamentoId,
              usuarioId: dados.usuarioId,
              total,

              itens: {
                createMany: {
                  data: dados.itens.map((item) => ({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    valorUnit: item.valorUnit,
                    valorTotal: item.valorUnit * item.quantidade,
                  })),
                },
              },
            },
            include: {
              itens: true,
              cliente: true,
              formaPagamento: true,
            },
          })
          
          const estoqueServico = new SaidaEstoqueServico()
          // está sendo passado o transaction(prisma) por parametro.
          return await estoqueServico.executar(pedido.id, setor, prisma)
         })
      }

      if (setor === 'externo') {
        await prismaCliente.$transaction(async (prisma) => {
          const pedido = await prisma.pedidoExterno.create({
            data: {
              clienteId: dados.clienteId,
              formaPagamentoId: dados.formaPagamentoId,
              usuarioId: dados.usuarioId,
              total,

              itens: {
                createMany: {
                  data: dados.itens.map((item) => ({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    valorUnit: item.valorUnit,
                    valorTotal: item.valorUnit * item.quantidade,
                  })),
                },
              },
            },
            include: {
              itens: true,
              cliente: true,
              formaPagamento: true,
            },
          })

          const estoqueServico = new SaidaEstoqueServico()
          // está sendo passado o transaction(prisma) por parametro.
          return await estoqueServico.executar(pedido.id, setor, prisma)
        })
      }

      if (setor === 'balcao') {

        await prismaCliente.$transaction(async (prisma) => {
          const pedido = await prisma.pedidoBalcao.create({
            data: {
              cliente: dados.cliente || null,
              formaPagamentoId: Number(dados.formaPagamentoId),
              vendedor: dados.vendedor,
              nomeUsuario: dados.nomeUsuario,
              usuarioId: Number(dados.usuarioId),
              total,

              itens: {
                createMany: {
                  data: dados.itens.map((item) => ({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    valorUnit: item.valorUnit,
                    valorTotal: item.valorUnit * item.quantidade,
                  })),
                },
              },
            },
            include: {
              itens: true,
              formaPagamento: true,
            },
          })

          const estoqueServico = new SaidaEstoqueServico()
          // está sendo passado o transaction(prisma) por parametro.
          return await estoqueServico.executar(pedido.id, setor, prisma)
        })
      }

      else {
        throw new Error(ERRO_MSG_PEDIDOS.SETOR)
      }
    } catch (error) {
      console.log( error)
      throw error
    }
  }
}

export { CriarPedidoServico }

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

        // Força uma conexão com o bancoantes do transaction.
        await prismaCliente.$queryRaw`SELECT 1`;

        await prismaCliente.$transaction(async (prisma) => { 
          const pedido = await prisma.pedidoDelivery.create({
            data: {
              clienteId: Number(dados.cliente),
              formaPagamentoId: Number(dados.formaPagamentoId),
              vendedor: dados.vendedor,
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
              cliente: true,
              formaPagamento: true,
            },
          })
          
          const estoqueServico = new SaidaEstoqueServico()
          // está sendo passado o transaction(prisma) por parametro.
          return await estoqueServico.executar(pedido.id, setor, prisma)
          },
          {
            timeout: 20000
          }
        )
      }

      if (setor === 'externo') {

        // Força uma conexão com o bancoantes do transaction.
        await prismaCliente.$queryRaw`SELECT 1`;

        await prismaCliente.$transaction(async (prisma) => {
          const pedido = await prisma.pedidoExterno.create({
            data: {
              clienteId: Number(dados.cliente),
              formaPagamentoId: Number(dados.formaPagamentoId),
              vendedor: dados.vendedor,
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
              cliente: true,
              formaPagamento: true,
            },
          }
        )

        const estoqueServico = new SaidaEstoqueServico()
        // está sendo passado o transaction(prisma) por parametro.
        return await estoqueServico.executar(pedido.id, setor, prisma)
        },
        {
          timeout: 20000
        }
      )
      }

      if (setor === 'balcao') {

        // Força uma conexão com o bancoantes do transaction.
        await prismaCliente.$queryRaw`SELECT 1`;

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
          },
          {
            timeout: 20000
          }
        )

      }

      else {
        throw new Error(ERRO_MSG_PEDIDOS.SETOR)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { CriarPedidoServico }

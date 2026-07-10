import { ERRO_MSG_PEDIDOS } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'
import { SaidaEstoqueServico } from '../estoque/saida/saidaEstoqueServico.js'

class CriarPedidoServico {
  async executar(setor, dados) {
    console.log('Debug setor: ', setor)
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

          console.log('pedidos: ', pedido.itens);
          
          const estoqueServico = new SaidaEstoqueServico()
          // está sendo passado o transaction(prisma) por parametro.
          return await estoqueServico.executar(pedido.id, setor, prisma)
          },
          {
            timeout: 20000
          }
        )
      }

      else if (setor === 'externo') {

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

      else if (setor === 'balcao') {

        // Força uma conexão com o bancoantes do transaction.
        await prismaCliente.$queryRaw`SELECT 1`;

        console.log('Dados: ', dados)

        await prismaCliente.$transaction(async (prisma) => {
          const pedido = await prisma.pedidoBalcao.create({
            data: {
              cliente: dados.cliente || null,
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
              pagamentos: {
                include: {
                  formaPagamento: true,
                },
              },
            },
          })

          if (dados.pagamentos?.length >= 1) {

            // Aqui valida se as duas formas de pagamentos somadas são o mesmo que o total do pedido
              const totalPagamentos = dados.pagamentos.reduce(
                  (acc, pagamento) => acc + Number(pagamento.valor),
                  0
              )
              if (Math.abs(totalPagamentos - total) > 0.01) {
                  throw new Error(
                    "A soma das formas de pagamento é diferente do total do pedido."
                  )
              }


              await prisma.pagamentoPedidoBalcao.createMany({
                  data: dados.pagamentos.map((pagamento) => ({
                      pedidoId: pedido.id,
                      formaPagamentoId: Number(pagamento.idFormaPagamentoParcial),
                      valor: Number(pagamento.valorParcialFormaPagamento),
                  })),
              })
          }


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

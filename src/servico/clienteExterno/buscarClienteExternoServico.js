import prismaCliente from '../../prisma/index.js'

class BuscarClienteExternoServico {
  async executar(clientes) {
    try {
      if (!clientes || clientes.length === 0) {
        throw new Error('Clientes não encontrados')
      }
      for (const cliente of clientes) {
        console.log(clientes)

        await prismaCliente.clienteExterno.upsert({
          where: {
            id: Number(cliente.ID),
          },
          update: {
            nome: cliente.Nome,
            cnpj: String(cliente.DocFiscal),
            cidade: cliente.Cidade,
            endereco: cliente.Endereco,
            telefone: String(cliente.Telefone),
            vendedor: cliente.Vendedor,
            atendimento: cliente.Atendimento,
            frequencia: cliente.Frequencia,
          },
          create: {
            id: Number(cliente.ID),
            nome: cliente.Nome,
            cnpj: String(cliente.DocFiscal),
            cidade: cliente.Cidade,
            endereco: cliente.Endereco,
            telefone: String(cliente.Telefone),
            vendedor: cliente.Vendedor,
            atendimento: cliente.Atendimento,
            frequencia: cliente.Frequencia,
          },
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export { BuscarClienteExternoServico }

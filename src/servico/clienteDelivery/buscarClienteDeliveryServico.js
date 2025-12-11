import prismaCliente from '../../prisma/index.js'

class BuscarClienteDeliveryServico {
  async executar(clientes) {
    try {
      if (!clientes || clientes.length === 0) {
        throw new Error('Clientes não encontrados!')
      }
      for (const cliente of clientes) {
        console.log(clientes)

        await prismaCliente.clienteDelivery.upsert({
          where: {
            id: Number(cliente.ID),
          },
          update: {
            nome: cliente.Nome,
            telefone: String(cliente.Telefone),
            endereco: cliente.Endereco,
            numero: cliente.Numero ? Number(cliente.Numero) : null,
            bairro: cliente.Bairro,
            cidade: cliente.Cidade,
            referencia: cliente.Referencia,
          },
          create: {
            id: Number(cliente.ID),
            nome: cliente.Nome,
            telefone: String(cliente.Telefone),
            endereco: cliente.Endereco,
            numero: cliente.Numero ? Number(cliente.Numero) : null,
            bairro: cliente.Bairro,
            cidade: cliente.Cidade,
            referencia: cliente.Referencia,
          },
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export { BuscarClienteDeliveryServico }

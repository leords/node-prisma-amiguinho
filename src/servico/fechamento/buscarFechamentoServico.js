import prismaCliente from '../../prisma/index.js'

class BuscarFechamentoServico {
  async executar(vendedor, setor, data) {
    // transformando a data em string e pegando apenas a data
    const dia = new Date().toISOString().split('T')[0]

    console.log('req dados: ', setor, vendedor, data)

    try {
      const resultado = await prismaCliente.fechamento.findFirst({
        where: {
          vendedor,
          setor,
          dia: data,
        },
      })

      if (!resultado) {
        return null
      }

      return resultado
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { BuscarFechamentoServico }

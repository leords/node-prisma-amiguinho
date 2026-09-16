import prismaCliente from '../../prisma/index.js'

class CriarFechamentoServico {
  async executar(setor, vendedor, data) {
    const dataAtual = new Date().toISOString().split('T')[0]

    console.log('DEBUG - DATA: ', data)
    try {
      const resultado = await prismaCliente.fechamento.upsert({
        where: {
          vendedor_dia_setor: {
            vendedor,
            dia: data,
            setor,
          },
        },
        update: {},
        create: {
          setor,
          vendedor,
          dia: data,
        },
      })

      return resultado
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { CriarFechamentoServico }

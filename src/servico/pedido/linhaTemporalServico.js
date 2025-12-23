import prismaCliente from '../../prisma/index.js'

class LinhaTemporalServico {
  async executar(setor, inicio, fim, vendedor, intervaloMinutos = 60) {
    try {
      //SETOR BALCAO
      if (setor === 'balcao') {
        // buscar pedido pelos filtros.
        const pedidos = await prismaCliente.pedidoBalcao.findMany({
          where: {
            vendedor: vendedor || undefined,
            data: {
              gte: new Date(inicio),
              lte: new Date(fim),
            },
          },
          select: {
            id: true,
            data: true,
            total: true,
          },
        })

        //agrupando em memoria por intervalo de tempo.
        const agrupadoPorHorario = {}

        pedidos.forEach((pedido) => {
          const data = new Date(pedido.data)

          //Calcula o bloco de tempo (ex: 30 em 30 min).
          const minutosTotais = data.getHours() * 60 + data.getMinutes()
          const bloco =
            Math.floor(minutosTotais / intervaloMinutos) * intervaloMinutos

          const hora = String(Math.floor(bloco / 60)).padStart(2, '0')
          const minuto = String(bloco % 60).padStart(2, '0')

          const chaveHorario = `${hora}:${minuto}`

          if (!agrupadoPorHorario[chaveHorario]) {
            agrupadoPorHorario[chaveHorario] = {
              horario: chaveHorario,
              totalVendido: 0,
              quantidadePedidos: 0,
            }
          }

          agrupadoPorHorario[chaveHorario].totalVendido += pedido.total
          agrupadoPorHorario[chaveHorario].quantidadePedidos += 1
        })

        // transforma em array ordenado.
        return Object.values(agrupadoPorHorario).sort((a, b) =>
          a.horario.localeCompare(b.horario)
        )
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { LinhaTemporalServico }

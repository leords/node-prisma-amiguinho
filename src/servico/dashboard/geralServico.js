class GeralServico {
  executar(dados) {
    const { balcao, delivery, externo } = dados.pedidos

    // Pegando o total por setor
    const totalBalcao = this.somarTotal(balcao)
    const totalDelivery = this.somarTotal(delivery)
    const totalExterno = this.somarTotal(externo)

    const totalVendas = totalBalcao + totalDelivery + totalExterno

    // Pegando a quantidade de pedidos
    const quantidadePedidos =
      balcao?.length + delivery?.length + externo?.length

    // Ticket médio
    const ticketMedio =
      quantidadePedidos === 0 ? 0 : totalVendas / quantidadePedidos

    // Vales internos
    const totalValeInterno = this.buscarValeInterno(balcao)

    // Buscar formas de pagamentos
    const formasPagamento = this.buscarFormasPagamento(
      balcao,
      delivery,
      externo,
      totalVendas
    )

    // Participação de cada setor

    const participacaoSetores = {
      balcao: this.percentual(totalBalcao, totalVendas),

      delivery: this.percentual(totalDelivery, totalVendas),

      externo: this.percentual(totalExterno, totalVendas),
    }

    return {
      totalVendas,

      quantidadePedidos,

      ticketMedio,

      totalValeInterno,

      participacaoSetores,

      formasPagamento,
    }
  }

  // Somar total
  somarTotal(lista) {
    return lista?.reduce((total, pedido) => {
      return total + pedido.total
    }, 0)
  }

  // Porcentual
  percentual(valor, total) {
    if (total === 0) return 0
    return Number(((valor / total) * 100).toFixed(2))
  }

  // Busca os vales internos
  buscarValeInterno(balcao) {
    let total = 0
    const lista = ['A VISTA', 'VALE', 'CARTÃO', 'CHEQUE', 'PIX']

    for (const pedido of balcao) {
      for (const pagamento of pedido.pagamentos) {
        if (!lista.includes(pagamento.formaPagamento.nome)) {
          total += pagamento.valor
        }
      }
    }
    return total
  }

  // Busca formas de pagamentos
  buscarFormasPagamento(balcao, delivery, externo, totalVendas) {
    const formas = {}
    const lista = ['A VISTA', 'VALE', 'CARTÃO', 'CHEQUE', 'PIX']

    // BALCÃO
    for (const pedido of balcao) {
      for (const pagamento of pedido.pagamentos) {
        // Valido que apenas as formas de pagamentos como a vista, pix, cartão, cheque e vale estão sendo calculadas.
        if (lista.includes(pagamento.formaPagamento.nome)) {
          const nome = pagamento.formaPagamento.nome
          if (!formas[nome]) {
            formas[nome] = 0
          }
          formas[nome] += pagamento.valor
        }
      }
    }

    // DELIVERY
    for (const pedido of delivery) {
      const nome = pedido.formaPagamento.nome

      // se não existir cria
      if (!formas[nome]) {
        formas[nome] = 0
      }

      // se existir, soma
      formas[nome] += pedido.total
    }

    // EXTERNO
    for (const pedido of externo) {
      const nome = pedido.formaPagamento.nome

      // se não existir cria
      if (!formas[nome]) {
        formas[nome] = 0
      }

      // se existir, soma
      formas[nome] += pedido.total
    }

    // convertendo o objeto formas em um array de objetos
    return Object.entries(formas).map(([nome, valor]) => ({
      nome,
      valor,
      percentual: this.percentual(valor, totalVendas),
    }))
  }
}

export { GeralServico }

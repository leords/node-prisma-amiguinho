class pedidoHelper {
  /**
   * Soma o total vendido.
   */
  static total(pedidos = []) {
    return pedidos.reduce((total, pedido) => {
      return total + Number(pedido.total)
    }, 0)
  }

  // Quantidade de pedidos.
  static quantidade(pedidos = []) {
    return pedidos.length
  }

  // Ticket médio.
  static ticketMedio(pedidos = []) {
    const quantidade = this.quantidade(pedidos)

    if (quantidade === 0) {
      return 0
    }

    return this.total(pedidos) / quantidade
  }

  // Agrupa pedidos por vendedor.
  static agruparPorVendedor(pedidos = []) {
    const vendedores = {}

    for (const pedido of pedidos) {
      const nome = pedido.vendedor ?? 'SEM VENDEDOR'

      if (!vendedores[nome]) {
        vendedores[nome] = []
      }

      vendedores[nome].push(pedido)
    }
    return vendedores
  }

  // Soma o total de um vendedor.
  static totalPorVendedor(pedidos = []) {
    const grupos = this.agruparPorVendedor(pedidos)
    const resultado = {}

    for (const vendedor in grupos) {
      resultado[vendedor] = this.total(grupos[vendedor])
    }
    return resultado
  }

  // Quantidade de pedidos por vendedor.
  static quantidadePorVendedor(pedidos = []) {
    const grupos = this.agruparPorVendedor(pedidos)
    const resultado = {}

    for (const vendedor in grupos) {
      resultado[vendedor] = grupos[vendedor].length
    }

    return resultado
  }

  // Ticket médio por vendedor.
  static ticketMedioPorVendedor(pedidos = []) {
    const grupos = this.agruparPorVendedor(pedidos)
    const resultado = {}

    for (const vendedor in grupos) {
      resultado[vendedor] = this.ticketMedio(grupos[vendedor])
    }
    return resultado
  }

  static mediaValorPedido(pedidos) {
    return this.ticketMedio(pedidos)
  }

  static maiorPedido(pedidos = []) {
    if (pedidos.length === 0) return 0

    return Math.max(...pedidos.map((p) => Number(p.total)))
  }

  static menorPedido(pedidos = []) {
    if (pedidos.length === 0) return 0

    return Math.min(...pedidos.map((p) => Number(p.total)))
  }
}

export default pedidoHelper

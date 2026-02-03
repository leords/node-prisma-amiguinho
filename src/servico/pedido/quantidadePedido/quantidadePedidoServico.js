import { QuantidadePedidoBalcao } from './quantidadePedidobalcao.js'
import { QuantidadePedidoDelivery } from './quantidadePedidoDelivery.js'
import { QuantidadePedidoExterno } from './quantidadePedidoExterno.js'

class QuantidadePedidoServico {
  async executar(setor, vendedor, dataInicio, dataFim) {
    try {

      if (setor === 'geral') {
        const [balcao, delivery, externo] = await Promise.all([
          QuantidadePedidoBalcao(vendedor, dataInicio, dataFim),
          QuantidadePedidoDelivery(vendedor, dataInicio, dataFim),
          QuantidadePedidoExterno(vendedor, dataInicio, dataFim)
        ]);

        return { balcao, delivery, externo }
      }
      if (setor === 'balcao') {
        return await QuantidadePedidoBalcao(vendedor, dataInicio, dataFim)
      }


      if (setor === 'delivery') {
        return await QuantidadePedidoDelivery(vendedor, dataInicio, dataFim)
      }

      if (setor === 'externo') {
        return await QuantidadePedidoExterno(vendedor, dataInicio, dataFim)
      }

    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { QuantidadePedidoServico }

import prismaCliente from '../../../prisma/index.js'
import { RelatorioMixProdutosBalcao } from './relatorioMixProdutosBalcao.js';
import { RelatorioMixProdutosDelivery } from './relatorioMixProdutosDelivery.js';
import { RelatorioMixProdutosExterno } from './relatorioMixProdutosExterno.js';

class RelatorioMixProdutosServico {
  async executar(setor, vendedor, dataInicio, dataFim) {

    try {
      if(setor === 'geral') {
        const [balcao, delivery, externo] = await Promise.all([
          RelatorioMixProdutosBalcao(vendedor, dataInicio, dataFim),
          RelatorioMixProdutosDelivery(vendedor, dataInicio, dataFim),
          RelatorioMixProdutosExterno(vendedor, dataInicio, dataFim),
        ]);

        return { balcao, delivery, externo };
      }

      if(setor === 'balcao') {
        return await RelatorioMixProdutosBalcao(vendedor, dataInicio, dataFim);
      }

      if(setor === 'delivery') {
        return await RelatorioMixProdutosDelivery(vendedor, dataInicio, dataFim);
      }

      if(setor === 'externo') {
          return await RelatorioMixProdutosExterno(vendedor, dataInicio, dataFim);
      }

    } catch (error) {
      throw error
    }
  }
}

export { RelatorioMixProdutosServico }

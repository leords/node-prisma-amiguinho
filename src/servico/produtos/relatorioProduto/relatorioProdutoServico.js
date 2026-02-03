import prismaCliente from "../../../prisma/index.js"
import { RelatorioProdutoBalcao } from "./relatorioProdutoBalcao.js"
import { RelatorioProdutoDelivery } from "./relatorioProdutoDelivery.js";
import { RelatorioProdutoExterno } from "./relatorioProdutoExterno.js";

class RelatorioProdutoServico {
    async executar(setor, inicio, fim, vendedor, produtoId) {


            try {
                if(setor === 'geral') {
                    const [balcao, delivery, externo] = await Promise.all([
                        RelatorioProdutoBalcao(inicio, fim, vendedor, produtoId),
                        RelatorioProdutoDelivery(inicio, fim, vendedor, produtoId),
                        RelatorioProdutoExterno(inicio, fim, vendedor, produtoId)
                    ]);
                    return { balcao, delivery, externo };
                }
                // BUSCANDO NO BALCAO
                if(setor === 'balcao') {
                    return await RelatorioProdutoBalcao(inicio, fim, vendedor, produtoId);
                }

                // BUSCANDO NO DELIVERY
                if(setor === 'delivery') {
                    return await RelatorioProdutoDelivery(inicio, fim, vendedor, produtoId);
                }

                // BUSCANDO NO EXTERNO
                if(setor === 'externo') {
                    return await RelatorioProdutoExterno(inicio, fim, vendedor, produtoId);
                }

            } catch (error) {
                throw error
        }
    }
}

export { RelatorioProdutoServico }
import { RelatorioBalcaoSTP } from "./relatorioSaidaTotalProdutos/relatorioBalcaoSTP.js"
import { RelatorioDeliverySTP } from "./relatorioSaidaTotalProdutos/relatorioDeliverySTP.js"
import { RelatorioExternoSTP } from "./relatorioSaidaTotalProdutos/relatorioExternoSTP.js"


class RelatorioSTPServico {
    async executar(setor, inicio, fim, produtoId) {

        try {

            if(setor === 'balcao') {
                const resultado = await RelatorioBalcaoSTP(inicio, fim, produtoId)

                return resultado
            }

            else if (setor === 'delivery') {
                const resultado = await RelatorioDeliverySTP(inicio, fim, produtoId)

                return resultado
            }

            else if (setor === 'externo') {
                const resultado = await RelatorioExternoSTP(inicio, fim, produtoId)

                return resultado
            } 

            else if (setor === 'geral') {

                const [balcao, delivery, externo] = await Promise.all([
                    RelatorioBalcaoSTP(inicio, fim, produtoId),
                    RelatorioDeliverySTP(inicio, fim, produtoId),
                    RelatorioExternoSTP(inicio, fim, produtoId)
                ])



                // Unindo todos os setores
                const produtos  = [
                    ...balcao,
                    ...delivery,
                    ...externo
                ]

                const produtosSomados = {}

                // percorrendo um à um e somando a quantidade
                produtos.forEach(item => {
                if (!produtosSomados[item.produto]) {
                    produtosSomados[item.produto] = 0
                }

                produtosSomados[item.produto] += item.quantidade
                })


                const resultadoFinal = Object.entries(produtosSomados).map(
                ([produto, quantidade]) => ({
                    produto,
                    quantidade
                })
                )

                // Ordenando
                resultadoFinal.sort((a, b) => b.quantidade - a.quantidade)
                
                return resultadoFinal
            }
            

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}


export { RelatorioSTPServico }
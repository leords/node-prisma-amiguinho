import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { RelatorioProdutoServico } from "../../servico/produtos/relatorioProduto/relatorioProdutoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"


class RelatorioProdutoControlador {
    async tratar(req, res) {

        const setor = req.params.setor
        const produtoId = req.params.produtoId ? Number(req.params.produtoId): undefined
        const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
        const dataFim = req.query.dataFim ? req.query.dataFim : undefined
        const vendedor = req.query.vendedor ? req.query.vendedor : undefined

        try {
            const opcaoSetores = ['balcao', 'delivery', 'externo', 'geral']
            if (!opcaoSetores.includes(setor)) {
                throw new Error('Setor inválido')
            }
            if(!setor) {
                throw new Error('Setor é obrigatório')
            }
            if(vendedor && typeof vendedor !== 'string') {
                throw new Error('Vendedor deve ser texto')
            }

            if(produtoId && isNaN(produtoId)) {
                throw new Error('Produto deve um número')
            }

            if (typeof dataInicio !== 'string' && typeof dataFim !== 'string') {
                throw new Error('Data de fim deve ser texto')
            }

            const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
            const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

            const servico = new RelatorioProdutoServico()
            const resultado = await servico.executar(setor, inicio, fim, vendedor, produtoId)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado);
        } catch (error) {
            console.log(error)
            const { status, mensagem } = coletarErro(error)
            return res.status(status).json(mensagem)
        }
    }
}

export { RelatorioProdutoControlador }
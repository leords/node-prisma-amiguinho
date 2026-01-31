

class RelatorioProduto {
    async tratar(req, res) {

        const { setor } = req.params.setor
        const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
        const dataFim = req.query.dataFim ? req.query.dataFim : undefined
        const vendedor = req.query.vendedor ? req.query.vendedor : undefined


    }
}

export { RelatorioProduto }
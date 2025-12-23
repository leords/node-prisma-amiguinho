import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { TopProdutosServico } from '../../servico/pedido/topProdutosServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class TopProdutoControlador {
  async tratar(req, res) {
    const { setor } = req.params
    const { dataInicio, dataFim } = req.query
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined
    const quantidade = req.query.quantidade
      ? Number(req.query.quantidade)
      : undefined

    try {
      const opcoesSetor = ['delivery', 'externo', 'balcao']

      console.log('datas ', dataInicio, dataFim)

      if (!setor) {
        throw new Error('Setor é obrigatório')
      }
      if (!opcoesSetor.includes(setor)) {
        throw new Error('Setor inválido')
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new Error('Vendedor deve ser texto')
      }
      if (!dataInicio && !dataFim) {
        throw new Error('Data de início e fim são obrigatórios')
      }
      if (dataInicio && typeof dataInicio !== 'string') {
        throw new Error('Data de início deve ser texto')
      }
      if (dataFim && typeof dataFim !== 'string') {
        throw new Error('Data de fim deve ser texto')
      }
      if (quantidade && quantidade <= 0) {
        throw new Error('Quantidade deve ser maior que 0')
      }
      if (!quantidade) {
        throw new Error('Quantidade é obrigatória')
      }
      if (isNaN(quantidade)) {
        throw new Error('Quantidade deve ser um número')
      }

      const fim = new Date(`${dataFim}T23:59:59.999-03:00`)
      const inicio = new Date(`${dataInicio}T00:00:00-03:00`)

      const servico = new TopProdutosServico()
      const resultado = await servico.executar(
        setor,
        inicio,
        fim,
        vendedor,
        quantidade
      )

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log('erro no controlador: ', error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { TopProdutoControlador }

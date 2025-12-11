import {
  ERRO_MSG_PRODUTO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { LerProdutosservico } from '../../servico/produtos/lerProdutosService.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerProdutosControlador {
  async tratar(req, res) {
    const id = req.query.id ? Number(req.query.id) : undefined
    const nome = req.query.nome ? req.query.nome : undefined
    const fornecedor = req.query.fornecedor ? req.query.fornecedor : undefined
    const segmento = req.query.segmento ? req.query.segmento : undefined

    try {
      if (id && isNaN(id)) {
        throw new Error(ERRO_MSG_PRODUTO.TIPO_ID)
      }
      if (nome && typeof nome !== 'string') {
        throw new Error(ERRO_MSG_PRODUTO.TIPO_NOME)
      }
      if (fornecedor && typeof fornecedor !== 'string') {
        throw new Error(ERRO_MSG_PRODUTO.TIPO_FORNECEDOR)
      }
      if (segmento && typeof segmento !== 'string') {
        throw new Error(ERRO_MSG_PRODUTO.TIPO_SEGMENTO)
      }

      const filtros = {
        id: id,
        nome: nome,
        fornecedor: fornecedor,
        segmento: segmento,
      }

      const servico = new LerProdutosservico()
      const resultado = await servico.executar(filtros)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.error(error)
      const { status, mensagem } = coletarErro(error)

      return res.status(status).json({ mensagem })
    }
  }
}

export { LerProdutosControlador }

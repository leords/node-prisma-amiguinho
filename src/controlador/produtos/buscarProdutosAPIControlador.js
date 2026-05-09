import {
  ERRO_MSG_PRODUTO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PRODUTO,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { BuscarProdutosAPIServico } from '../../servico/produtos/buscarProdutosAPIServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarProdutosAPIControlador {
  async tratar(req, res, next) {
    try {
      console.time("BuscarProdutos")
      const resposta = await fetch(
        'https://script.google.com/macros/s/AKfycby0sRecjBmrq-Odpt4K2lSIS18NX-569Lf7Axh9fVxZoIRMu3DxTnDDoOUFLpS9RIOXag/exec'
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new AppError(
          `Erro na coleta de produtos: ${resposta.status}`,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SETOR_NOT_FOUND"
        )
      }
      if (!dados || !dados.saida) {
        throw new AppError(
          ERRO_MSG_PRODUTO.SINCRONIZACAO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "SETOR_NOT_FOUND"
        )
      }

      const servico = new BuscarProdutosAPIServico()
      await servico.executar(dados.saida)
      console.timeEnd("BuscarProdutos")
      console.log("Produtos atualizados com sucesso!")

      return res
        .status(HTTP_STATUS_CODES.OK)
        .json(SUCESSO_MSG_PRODUTO.SINCRONIZACAO)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { BuscarProdutosAPIControlador }

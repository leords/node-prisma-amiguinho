import {
  ERRO_MSG_PRODUTO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PRODUTO,
} from '../../config/httpStatusCodes.js'

import { AppError } from '../../error/appError.js'
import { BuscarProdutosAPIServico } from '../../servico/produtos/buscarProdutosAPIServico.js'

class BuscarProdutosAPIControlador {
  async tratar(req, res, next) {
    try {
      console.time("BuscarProdutos")

      const resposta = await fetch(
        process.env.PRODUTOS
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

      return res.status(HTTP_STATUS_CODES.OK).json({
        message: SUCESSO_MSG_PRODUTO.SINCRONIZACAO
      })

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { BuscarProdutosAPIControlador }
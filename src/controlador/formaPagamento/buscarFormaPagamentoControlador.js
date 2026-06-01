import {
  ERRO_MSG_FORMA,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_FORMA,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { BuscarFormaPagamentoServico } from '../../servico/formaPagamento/buscarFormaPagamentoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class BuscarFormaPagamentControlador {
  async tratar(req, res, next) {
    try {
      console.time("BuscarFormasPagamento")
      const resposta = await fetch(process.env.FORMAS_PAGAMENTO)
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new AppError(
          `Erro na coleta de produtos: ${resposta.status}`,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "COLETA_PRODUTOS_BAD_REQUEST"
        )
      }
      if (!dados || !dados.saida) {
        throw new AppError(
          ERRO_MSG_FORMA.SINCRONIZACAO,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "COLETA_PRODUTOS_BAD_REQUEST"
        )
      }

      const servico = new BuscarFormaPagamentoServico()
      await servico.executar(dados.saida)

      console.log("Formas de pagamento atualizadas com sucesso!")

      return res.status(HTTP_STATUS_CODES.OK).json(SUCESSO_MSG_FORMA.SINCRONIZACAO)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { BuscarFormaPagamentControlador }

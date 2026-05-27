import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { bsucarValeInternoServico } from '../../servico/pedido/buscarValeInternoServico.js'

class buscarValesInternoControlador {
  async tratar(req, res, next) {
  
    const vendedor = req.query.vendedor ? req.query.vendedor : undefined
    const cliente = req.query.cliente ? req.query.cliente : undefined
    const formaPagamento = req.query.formaPagamentoId
      ? Number(req.query.formaPagamentoId)
      : undefined
    // Mantenho as datas vindos como strings, vem no formato 2025-12-14
    const dataInicio = req.query.dataInicio
    const dataFim = req.query.dataFim
    const usuarioId = req.query.usuarioId
      ? Number(req.query.usuarioId)
      : undefined
    const status = req.query.status ? req.query.status : undefined


    try {
      const opcoesVendedor = ['b1', 'b2', 'b3']

      if (vendedor && typeof vendedor !== 'string') {
        throw new AppError(
          "Vendedor inválido",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "VENDEDOR_NOT_FOUND"
        )
      }

      if (cliente && typeof cliente !== 'string') {
        throw new AppError(
          "Cliente inválido",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "CLIENTE_NOT_FOUND"
        )
      }
      if (formaPagamento && isNaN(formaPagamento)) {
        throw new AppError(
          "Forma de pagamento inválida",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "FORMA_PAGAMENTO_NOT_FOUND"
        )
      }
      if (usuarioId && isNaN(usuarioId)) {
        throw new AppError(
          "ID de usuário inválido",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "USUARIO_NOT_FOUND"
        )
      }

      if(status && typeof status !== 'string') {
        throw new AppError(
          "Status inválido",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "STATUS_NOT_FOUND"
        )
      }

      // valido a tipagem das datas.
      if (
        dataInicio &&
        typeof dataInicio !== 'string' &&
        dataFim &&
        typeof dataFim !== 'string'
      ) {
        throw new AppError(
          "Data inválida",
          HTTP_STATUS_CODES.BAD_REQUEST,
          "DATA_NOT_FOUND"
        )
      }

      // transformo elas em ISO manualmente. desta forma consigo pegar o intervalo do dia inteiro.
      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

      const servico = new bsucarValeInternoServico()
      const resultado = await servico.executar(
        vendedor,
        cliente,
        formaPagamento,
        inicio,
        fim,
        usuarioId,
        status
      )

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { buscarValesInternoControlador }

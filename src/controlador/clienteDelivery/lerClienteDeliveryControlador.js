import {
  ERRO_MSG_CLIENTE_DELIVERY,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
import { LerClienteDeliveryServico } from '../../servico/clienteDelivery/lerClienteDeliveryServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerClienteDeliveryControlador {
  async tratar(req, res, next) {
    const id = req.query.id ? Number(req.query.id) : undefined
    const nome = req.query.nome ? req.query.nome : undefined
    const cidade = req.query.cidade ? req.query.cidade : undefined
    const bairro = req.query.bairro ? req.query.bairro : undefined

    try {
      if (id && isNaN(id)) {
        throw new AppError(
          "ID é obrigatório e deve ser um número",
          HTTP_STATUS_CODES.NOT_FOUND,
          "ID_NOT_FOUND"
        )
      }
      if (nome && typeof nome !== 'string') {
        throw new AppError(
          "Nome é obrigatório e deve ser uma string",
          HTTP_STATUS_CODES.NOT_FOUND,
          "NOME_NOT_FOUND"
        )
      }
      if (cidade && typeof cidade !== 'string') {
        throw new AppError(
          "cidade é obrigatório e deve ser uma string",
          HTTP_STATUS_CODES.NOT_FOUND,
          "CIDADE_NOT_FOUND"
        )
      }
      if (bairro && typeof bairro !== 'string') {
        throw new AppError(
          "Bairro é obrigatório e deve ser uma string",
          HTTP_STATUS_CODES.NOT_FOUND,
          "BAIRRO_NOT_FOUND"
        )
      }

      const filtros = {
        id: id,
        nome: nome,
        cidade: cidade,
        bairro: bairro,
      }

      const servico = new LerClienteDeliveryServico()
      const resultado = await servico.executar(filtros)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { LerClienteDeliveryControlador }

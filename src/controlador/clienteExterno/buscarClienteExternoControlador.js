import {
  ERRO_MSG_CLIENTE_EXTERNO,
  SUCESSO_MSG_CLIENTE_EXTERNO,
} from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { BuscarClienteExternoServico } from '../../servico/clienteExterno/buscarClienteExternoServico.js'
import { AppError } from '../../error/appError.js'

class BuscarClienteExternoControlador {
  async tratar(req, res, next) {
    try {
      // DEPOIS USAR .ENV PARA A URL DO GOOGLE SHEET
      const resposta = await fetch(
        'https://script.google.com/macros/s/AKfycbyCzg47M3MRq6xFYxkeacXHhtW6JKdVGijiMbIXgcbGeHWkt_xI26_SYsXejmANQO04/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'externa',
          }),
        }
      )
      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new AppError(
          `Erro na sincronização da coleta de clientes externos: ${resposta.status}`,
          HTTP_STATUS_CODES.NOT_FOUND,
          "COLETA_CLIENTES_NOT_FOUND"
        )
      }

      if (!dados || !dados.saida) {

        throw new AppError(
          "Não foi encontrado clientes externos",
          HTTP_STATUS_CODES.NOT_FOUND,
          "COLETA_CLIENTES_NOT_FOUND"
        )
      }

      const servico = new BuscarClienteExternoServico()
      await servico.executar(dados.saida)

      return res.status(HTTP_STATUS_CODES.OK).json({
        message: SUCESSO_MSG_CLIENTE_EXTERNO.SINCRONIZACAO,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { BuscarClienteExternoControlador }

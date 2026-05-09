import { LerClienteExternoServico } from '../../servico/clienteExterno/lerClienteExternoServico.js'
import {
  ERRO_MSG_CLIENTE_EXTERNO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import { AppError } from '../../error/appError.js'

class LerClienteExternoControlador {
  async tratar(req, res, next) {
    try {
      const id = req.query.id ? Number(req.query.id) : undefined
      const nome = req.query.nome ? req.query.nome : undefined
      const cnpj = req.query.cnpj ? req.query.cnpj : undefined
      const cidade = req.query.cidade ? req.query.cidade : undefined
      const endereco = req.query.endereco ? req.query.endereco : undefined
      const vendedor = req.query.vendedor ? req.query.vendedor : undefined
      const atendimento = req.query.atendimento
        ? req.query.atendimento
        : undefined
      const frequencia = req.query.frequencia ? req.query.frequencia : undefined

      if (id && isNaN(id)) {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_ID,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "ID_BAD_REQUEST"
        )
      }
      if (nome && typeof nome !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_NOME,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "NOME_BAD_REQUEST"
        )        
      }
      if (cnpj && typeof cnpj !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_CNPJ,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "CNPJ_BAD_REQUEST"
        )  
      }
      if (cidade && typeof cidade !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_CIDADE,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "CIDADE_BAD_REQUEST"
        )        
      }
      if (endereco && typeof endereco !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_ENDERECO,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "ENDERECO_BAD_REQUEST"
        )        
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_VENDEDOR,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "VENDEDOR_BAD_REQUEST"
        )
      }
      if (atendimento && typeof atendimento !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_ATENDIMENTO,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "ATENDIMENTO_BAD_REQUEST"
        )
      }
      if (frequencia && typeof frequencia !== 'string') {
        throw new AppError(
            ERRO_MSG_CLIENTE_EXTERNO.TIPO_FREQUENCIA,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "FREQUENCIA_BAD_REQUEST"
        )
      }

      const filtros = {
        id: id,
        nome: nome,
        cnpj: cnpj,
        cidade: cidade,
        endereco: endereco,
        vendedor: vendedor,
        atendimento: atendimento,
        frequencia: frequencia,
      }

      const servico = new LerClienteExternoServico()
      const resultado = await servico.executar(filtros)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      next()
    }
  }
}

export { LerClienteExternoControlador }

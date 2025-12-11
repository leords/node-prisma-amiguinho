import { LerClienteExternoServico } from '../../servico/clienteExterno/lerClienteExternoServico.js'
import {
  ERRO_MSG_CLIENTE_EXTERNO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class LerClienteExternoControlador {
  async tratar(req, res) {
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
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_ID)
      }
      if (nome && typeof nome !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_NOME)
      }
      if (cnpj && typeof cnpj !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_CNPJ)
      }
      if (cidade && typeof cidade !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_CIDADE)
      }
      if (endereco && typeof endereco !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_ENDERECO)
      }
      if (vendedor && typeof vendedor !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_VENDEDOR)
      }
      if (atendimento && typeof atendimento !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_ATENDIMENTO)
      }
      if (frequencia && typeof frequencia !== 'string') {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.TIPO_FREQUENCIA)
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

      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json(mensagem)
    }
  }
}

export { LerClienteExternoControlador }

import {
  ERRO_MSG_NIVEL_ACESSO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_NIVEL_ACESSO,
} from '../../config/httpStatusCodes.js'
import { CriarNivelAcessoServico } from '../../servico/nivelAcesso/criarNivelAcessoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class CriarNivelAcessoControlador {
  async tratar(req, res) {
    try {
      const { nome } = req.body

      if (!nome) {
        throw new Error(ERRO_MSG_NIVEL_ACESSO.CAMPO_AUSENTE)
      }
      if (typeof nome !== 'string') {
        throw new Error(ERRO_MSG_NIVEL_ACESSO.TIPO_NOME)
      }

      const servico = new CriarNivelAcessoServico()
      const resultado = await servico.executar(nome)

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        resultado: resultado,
        mensagem: SUCESSO_MSG_NIVEL_ACESSO.CRIADO,
      })
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { CriarNivelAcessoControlador }

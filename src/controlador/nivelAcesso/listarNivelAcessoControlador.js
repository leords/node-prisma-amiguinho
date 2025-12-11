import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { ListarNivelAcessoServico } from '../../servico/nivelAcesso/listarNivelAcessoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ListarNivelAcessoControlador {
  async tratar(req, res) {
    try {
      const servico = new ListarNivelAcessoServico()
      const resultado = await servico.executar()

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { ListarNivelAcessoControlador }

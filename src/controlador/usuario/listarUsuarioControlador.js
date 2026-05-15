import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { listarUsuarioServico } from '../../servico/usuario/listarUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ListarUsuarioControlador {
  async tratar(req, res, next) {
    try {
      const servico = new listarUsuarioServico()
      const resultado = await servico.executar()


      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { ListarUsuarioControlador }

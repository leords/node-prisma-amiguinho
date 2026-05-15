import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import { ListarUsuarioServico } from '../../servico/usuario/ListarUsuarioServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'

class ListarUsuarioControlador {
  async tratar(req, res, next) {
    try {
      const servico = new ListarUsuarioServico()
      const resultado = await servico.executar()

      
      return res.status(HTTP_STATUS_CODES.OK).json({ resultado })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { ListarUsuarioControlador }

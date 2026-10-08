import { EditarMotoristaServico } from '../../servico/motorista/editarMotoristaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_MOTORISTA,
} from '../../config/httpStatusCodes.js'

class EditarMotoristaControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params
      const { telefone, status } = req.body

      const servico = new EditarMotoristaServico()
      const resultado = await servico.executar({ id, telefone, status })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_MOTORISTA.ATUALIZADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { EditarMotoristaControlador }

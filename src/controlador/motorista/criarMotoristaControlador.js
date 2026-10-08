import { CriarMotoristaServico } from '../../servico/motorista/criarMotoristaServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_MOTORISTA,
} from '../../config/httpStatusCodes.js'

class CriarMotoristaControlador {
  async tratar(req, res, next) {
    try {
      const { nome, cpf, telefone } = req.body

      const servico = new CriarMotoristaServico()
      const resultado = await servico.executar({ nome, cpf, telefone })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_MOTORISTA.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarMotoristaControlador }

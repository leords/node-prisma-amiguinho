import { CriarVeiculoServico } from '../../servico/veiculo/criarVeiculoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_VEICULO,
} from '../../config/httpStatusCodes.js'

class CriarVeiculoControlador {
  async tratar(req, res, next) {
    try {
      const { nome, modelo, marca, placa, pesoMaximo } = req.body

      const servico = new CriarVeiculoServico()
      const resultado = await servico.executar({
        nome,
        modelo,
        marca,
        placa,
        pesoMaximo,
      })

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_VEICULO.CRIADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { CriarVeiculoControlador }

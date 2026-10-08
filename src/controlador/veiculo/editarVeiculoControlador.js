import { EditarVeiculoServico } from '../../servico/veiculo/editarVeiculoServico.js'
import {
  HTTP_STATUS_CODES,
  SUCESSO_MSG_VEICULO,
} from '../../config/httpStatusCodes.js'

class EditarVeiculoControlador {
  async tratar(req, res, next) {
    try {
      const { id } = req.params
      const { nome, modelo, marca, placa, pesoMaximo, status, emRota } =
        req.body

      const servico = new EditarVeiculoServico()
      const resultado = await servico.executar({
        id,
        nome,
        modelo,
        marca,
        placa,
        pesoMaximo,
        status,
        emRota,
      })

      return res.status(HTTP_STATUS_CODES.OK).json({
        mensagem: SUCESSO_MSG_VEICULO.ATUALIZADO,
        resultado,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { EditarVeiculoControlador }

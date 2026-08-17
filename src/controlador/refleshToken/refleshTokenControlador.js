// controllers/RefreshToken.js
import { AutenticadorServico } from '../../auth/autenticadorServico.js'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'


class RefreshTokenControlador {
  async tratar(req, res, next) {
    const { refreshToken } = req.body

    try {
      const servico = new AutenticadorServico()
      const resultado = await servico.refresh(refreshToken)

      return res.status(HTTP_STATUS_CODES.OK).json(resultado)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export { RefreshTokenControlador }

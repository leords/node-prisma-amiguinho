import {
  ERRO_MSG_AUTENTICADOR,
  HTTP_STATUS_CODES,
} from '../config/httpStatusCodes.js'

const nivelAcessoMiddleware = (nivel) => {
  return (req, res, next) => {
    const usuario = req.user

    const nivelUsuario = Number(usuario?.nivelAcesso)

    // Valida se o nivel do usuário logado é o mesmo que o da rota
    if (!usuario || !nivel.includes(nivelUsuario)) {
      return res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ error: ERRO_MSG_AUTENTICADOR.ACESSO_NEGADO })
    }

    next()
  }
}

export { nivelAcessoMiddleware }

import jwt from 'jsonwebtoken' // ← ADICIONE ESTA IMPORTAÇÃO
import {
  ERRO_MSG_AUTENTICADOR,
  HTTP_STATUS_CODES,
} from '../config/httpStatusCodes.js'

function autenticadorMiddleware(req, res, next) {
  // ← ADICIONE OS PARÂMETROS
  const autCabecalho = req.headers.authorization

  if (!autCabecalho) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: ERRO_MSG_AUTENTICADOR.TOKEN_AUSENTE })
  }

  // Removendo a palavra "Bearer " do cabeçalho
  const token = autCabecalho.replace('Bearer ', '')

  // Tenta verificar (validar e decodificar) o token usando a chave secreta que está em .env
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRETA)
    req.user = decodificado // ← Aqui injeta o usuário no req

    // Se for válido, chama o next e a requisição continua
    next()
  } catch (error) {
    console.error('Erro na verificação do token:', error)
    // Se o token for inválido, expirado ou mal formado, retorna erro 401
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED) // ← CORRIGIDO: deveria ser 401, não 404
      .json({ message: ERRO_MSG_AUTENTICADOR.TOKEN_INVALIDO })
  }
}

export { autenticadorMiddleware }

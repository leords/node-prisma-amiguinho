import { AppError } from "../error/AppError.js"
import { HTTP_STATUS_CODES } from "../config/httpStatusCodes.js"

// middleware de erro
function tratarErros(error, req, res, next) {

  // Erros vindo do appError - 400, 401, 404, 409
  // error.statusCode && error.code só existem no AppError
  if (error.statusCode && error.code) {
    return res.status(error.statusCode).json({
      sucesso: false,
      erro: {
        mensagem: error.message,
        codigo: error.code
      }
    })
  }

  console.error("ERRO INTERNO:", error)

  // Erros de bug - 500
  return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    sucesso: false,
    erro: {
      mensagem: "Erro interno do servidor",
      codigo: "INTERNAL_SERVER_ERROR"
    }
  })
}

export { tratarErros }
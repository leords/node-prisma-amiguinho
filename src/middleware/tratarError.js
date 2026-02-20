import { HTTP_STATUS_CODES } from "../config/httpStatusCodes.js"

function tratarErros(error, req, res, next) {

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      sucesso: false,
      erro: {
        mensagem: error.message,
        codigo: error.code
      }
    })
  }

  console.error("ERRO INTERNO:", error)

  return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    sucesso: false,
    erro: {
        message: "Erro interno do servidor",
        code: "INTERNAL_SERVER_ERROR"
    }
  })
}

export { tratarErros }
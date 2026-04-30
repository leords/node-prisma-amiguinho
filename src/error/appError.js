

class AppError extends Error {
  constructor(message, statusCode = 400, code = null) { // executa quando instancia e monta o objeto
    super(message) // chama o constructor da classe pai
    this.statusCode = statusCode // completa a criação do filho
    this.code = code
  }
}

export { AppError }
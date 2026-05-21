import { Resend } from 'resend'
import { AppError } from '../../error/appError'
import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes'

class EnviarEmailServico {
  async enviarNovoEmail (to, subject, html) {
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
      await resend.emails.send({
        from: 'Sistema <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html,
      })
    } catch (error) {
      console.log("Erro ao enviar email: ", error)

      throw new AppError(
        "FALHA_ENVIO_EMAIL",
        HTTP_STATUS_CODES.BAD_REQUEST,
        "EMAIL_BAD_REQUEST"
      )
    }
  }

}

export { EnviarEmailServico }

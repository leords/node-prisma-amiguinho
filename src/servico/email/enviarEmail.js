import nodemailer from 'nodemailer'

class EnviarEmail {
  constructor() {
    // Criamos o transporter do Nodemailer.
    // Aqui é um exemplo usando SMTP clássico.
    // Ajuste para seu provedor de e-mail.
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // Ex: smtp.gmail.com
      port: Number(process.env.MAIL_PORT), // 465 (SSL) ou 587 (TLS)
      secure: process.env.MAIL_SECURE === 'true', // true = SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Método principal para enviar e-mail
  // ---------------------------------------------------------------------------
  async enviar({ to, subject, html }) {
    try {
      // Configuração do e-mail
      const mailOptions = {
        from: `Sistema <${process.env.MAIL_USER}>`, // remetente
        to, // destinatário
        subject,
        html, // corpo do e-mail em HTML
      }

      // Enviando o e-mail
      await this.transporter.sendMail(mailOptions)

      console.log('E-mail enviado para:', to)
    } catch (err) {
      console.error('Erro ao enviar e-mail =>', err)
      throw new Error('FALHA_ENVIO_EMAIL')
    }
  }
}

export { EnviarEmail }

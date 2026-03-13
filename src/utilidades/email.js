import nodemailer from "nodemailer";
 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});
 
/**
 * Envia um e-mail via Gmail SMTP.
 * @param {Object} params
 * @param {string|string[]} params.para - destinatário(s)
 * @param {string} params.assunto
 * @param {string} params.html
 */
export async function enviarEmail({ para, assunto, html }) {
  
  try {
    await transporter.sendMail({
      from: `Amigão Distribuidora <${process.env.GMAIL_USER}>`,
      to: Array.isArray(para) ? para.join(", ") : para,
      subject: assunto,
      html,
    });
 
    console.log(`[EMAIL] Enviado para: ${para} | Assunto: ${assunto}`);
  } catch (err) {
    console.error("[EMAIL] Erro ao enviar:", err.message);
  }
}
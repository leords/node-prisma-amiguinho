import { processarMensagemWhatsAppServico } from '../../servico/whatsapp/webHookWhatsServico.js'

class processarMensagemWhatsAppControlador {
  async tratar(req, res) {
    try {
      // Responde rapidamente para a Evolution
      res.sendStatus(200)

      // Processa a mensagem
      const servico = new processarMensagemWhatsAppServico()
      const resultado = await servico.executar(req.body)

      return resultado
    } catch (error) {
      console.error('[WHATSAPP WEBHOOK] Erro:', error)
    }
  }
}

export { processarMensagemWhatsAppControlador }

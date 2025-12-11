import { CriarPedidoServico } from '../../servico/pedido/criarPedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PEDIDOS,
} from '../../config/httpStatusCodes.js'

class CriarPedidoControlador {
  async tratar(req, res) {
    try {
      const { setor } = req.body
      const {
        cliente,
        formaPagamentoId,
        vendedor,
        nomeUsuario,
        usuarioId,
        itens,
      } = req.body.dados

      // ---------------------
      // Validando o setor
      // ---------------------

      const opcoesSetor = ['delivery', 'externo', 'balcao']
      if (!opcoesSetor.includes(setor)) {
        throw new Error(ERRO_MSG_PEDIDOS.SETOR)
      }
      // validando apenas se o setor for balcao.
      if (setor === 'balcao') {
        if (itens.cliente && typeof itens.cliente !== 'string') {
          console.log('erro no cliente')
          throw new Error('Se cliente for inserido, precisa ser do tipo texto')
        }
      }

      // ---------------------
      // Validando os dados
      // ---------------------

      if (cliente) {
        if (typeof cliente !== 'string')
          throw new Error('Se cliente for inserido, precisa ser do tipo texto')
      }
      if (!formaPagamentoId) {
        throw new Error(
          `Forma de pagamento é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`
        )
      }
      if (!vendedor)
        throw new Error(`Vendedor é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`)
      if (!usuarioId)
        throw new Error(`ID de usuário é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`)
      if (!nomeUsuario)
        throw new Error(`Nome é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`)
      if (!itens || !Array.isArray(itens) || itens.length === 0)
        throw new Error(ERRO_MSG_PEDIDOS.LISTA_PEDIDOS)

      // validar UM POR UM e RETORNAR MSG ESPECIFICA
      itens.forEach((item) => {
        if (!item.produtoId || !item.quantidade || !item.valorUnit) {
          throw new Error(ERRO_MSG_PEDIDOS.CAMPO_AUSENTE)
        }
      })

      const itensValidados = itens.map((item, index) => {
        //convertendo para números;
        const produtoId = Number(item.produtoId)
        const quantidade = Number(item.quantidade)
        const valorUnit = Number(item.valorUnit)

        if (isNaN(produtoId)) {
          throw new Error(`Item ${index + 1}: produtoId inválido`)
        }
        if (isNaN(quantidade)) {
          throw new Error(`Item ${index + 1}: quantidade inválida`)
        }
        if (isNaN(valorUnit)) {
          throw new Error(`Item ${index + 1}: valorUnit inválido`)
        }

        return {
          ...item,
          produtoId,
          quantidade,
          valorUnit,
        }
      })

      const dados = {
        cliente,
        formaPagamentoId: Number(formaPagamentoId),
        vendedor,
        nomeUsuario,
        usuarioId: Number(usuarioId),
        itens: itensValidados,
      }

      const servico = new CriarPedidoServico()
      const resultado = await servico.executar(setor, dados)

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        mensagem: SUCESSO_MSG_PEDIDOS.CRIADO,
        resultado: resultado,
      })
    } catch (error) {
      console.log('ERRO AO CRIAR PEDIDO:', error)
      const { status, mensagem } = coletarErro(error)
      return res.status(status).json({ mensagem })
    }
  }
}

export { CriarPedidoControlador }

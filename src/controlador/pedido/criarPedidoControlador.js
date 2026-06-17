import { CriarPedidoServico } from '../../servico/pedido/criarPedidoServico.js'
import { coletarErro } from '../../utilidades/coletarErro.js'
import {
  ERRO_MSG_PEDIDOS,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_PEDIDOS,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'

class CriarPedidoControlador {
  async tratar(req, res, next) {
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

      // valido o body
      if (!req.body.dados) {
        throw new AppError(
          'Dados não informados',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'DADOS_NOT_FOUND'
        )
      }
    
      // valida o setor.
      console.log('SETOR: ', setor)
      const opcoesSetor = ['delivery', 'externo', 'balcao']
      if (!opcoesSetor.includes(setor)) {
        console.log('erro no setor')
        throw new AppError(
          ERRO_MSG_PEDIDOS.SETOR,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "PRDUTO_NOT_FOUND"
        )
      }

      // valida cliente apenas se setor for diferente de balcão.
      if(setor !== 'balcao') {
        if(!cliente) {
          throw new AppError(
            `Cliente id é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "CLIENTE_ID_NOT_FOUND"
          )
        }
      }

      if (!formaPagamentoId) {
        throw new AppError(
            `Forma de pagamento é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "FORMA_PAGAMENTO_NOT_FOUND"
        )
      }

      if (!vendedor) {
        throw new AppError(
            `Vendedor é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "VENDEDOR_NOT_FOUND"
        )
      }

      if (!usuarioId) {
        throw new AppError(
            `ID de usuário é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
        )
      }

      if(setor === 'balcao') {
        if (!nomeUsuario) {
          throw new AppError(
            `Nome é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "NOME_USUARIO_NOT_FOUND"
          )
        }
      }

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
          throw new AppError(
            ERRO_MSG_PEDIDOS.LISTA_PEDIDOS,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
        )
      }
      
      // Valida a existencia de um por um dos campos dos itens da lista.
      itens.forEach((item) => {
        if (!item.produtoId || !item.quantidade || !item.valorUnit) {
          throw new AppError(
            ERRO_MSG_PEDIDOS.CAMPO_AUSENTE,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRODUTO_NOT_FOUND"
          )
        }
      })

      // Converte e valida a tipagem dos campos de cada item.
      const itensValidados = itens.map((item, index) => {
        //convertendo para números;
        const produtoId = Number(item.produtoId)
        const quantidade = Number(item.quantidade)
        const valorUnit = Number(item.valorUnit)

        if (isNaN(produtoId)) {
          throw new AppError(
            `Item ${index + 1}: produtoId inválido`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
          )
        }
        if (isNaN(quantidade)) {
          throw new AppError(
            `Item ${index + 1}: quantidade inválida`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "QUANTIDADE_NOT_FOUND"
          )
        }
        if (isNaN(valorUnit)) {
          throw new AppError(
            `Item ${index + 1}: quantidade inválida`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "VALOR_UND_NOT_FOUND"
          )
        }

        return {
          ...item,
          produtoId,
          quantidade,
          valorUnit,
        }
      })

      // Formato de envio para o serviço especifico para pedidos Balcão.
      if(setor === 'balcao') {

        // valido cliente do tipo string apenas quando vem da req para novo pedido balcão.
        if (cliente && typeof cliente !== 'string')
          throw new AppError(
            'Se cliente for inserido, precisa ser do tipo texto',
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
        )

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
      }

      const clienteId = Number(cliente)
      const formaPagamentoIdFormatado = Number(formaPagamentoId)
      const usuarioIdFormatado = Number(usuarioId)

      if(isNaN(clienteId)) {
        throw new AppError(
          'Cliente inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'CLIENTE_INVALIDO'
        )
      }
      if(isNaN(formaPagamentoIdFormatado)) {
        throw new AppError(
          'Forma de pagamento inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'FORMA_PAGAMENTO_INVALIDO'
        )
      }
      if(isNaN(usuarioIdFormatado)) {
        throw new AppError(
          'Usuario id inválido',
          HTTP_STATUS_CODES.BAD_REQUEST,
          'USUARIO_ID_INVALIDO'
        )
      }

      // Envio para o serviço de delivery e externo.
      const dados = {
        cliente: clienteId,
        formaPagamentoId: formaPagamentoIdFormatado,
        vendedor,
        usuarioId: usuarioIdFormatado,
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
      next(error)
    }
  }
}

export { CriarPedidoControlador }

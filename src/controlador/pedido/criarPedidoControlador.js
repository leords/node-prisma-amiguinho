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

      // ---------------------
      // Validando o setor
      // ---------------------

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

      // validando apenas se o setor for balcao.
      if (setor === 'balcao') {
        if (itens.cliente && typeof itens.cliente !== 'string') {
          console.log('erro no cliente')

          throw new AppError(
            'Se cliente for inserido, precisa ser do tipo texto',
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
          )
        }
      }


      // Validando os dados

      // Aqui valida apenas se é string, se for pedido para balcao, 
      if(setor === 'balcao') {
        if (cliente) {
          if (typeof cliente !== 'string')
            throw new AppError(
              'Se cliente for inserido, precisa ser do tipo texto',
              HTTP_STATUS_CODES.BAD_REQUEST,
              "PRDUTO_NOT_FOUND"
          )
        }
      }

      if(!cliente) {
        throw new AppError(
            `Cliente id é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "CLIENTE_ID_NOT_FOUND"
        )
      }

      if (!formaPagamentoId) {
        throw new AppError(
            `Forma de pagamento é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "FORMA_PAGAMENTO_NOT_FOUND"
        )

      }

      if (!vendedor) {
        throw new AppError(
            `Vendedor é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "VENDEDOR_NOT_FOUND"
        )
      }

      if (!usuarioId) {
        throw new AppError(
            `ID de usuário é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRDUTO_NOT_FOUND"
        )
      }

      if(setor === 'balcao') {
        if (!nomeUsuario) {
          throw new AppError(
            `Nome é ${ERRO_MSG_PEDIDOS.CAMPO_AUSENTE}}`,
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
      
      // validar UM POR UM e RETORNAR MSG ESPECIFICA
      itens.forEach((item) => {
        if (!item.produtoId || !item.quantidade || !item.valorUnit) {
          throw new AppError(
            ERRO_MSG_PEDIDOS.CAMPO_AUSENTE,
            HTTP_STATUS_CODES.BAD_REQUEST,
            "PRODUTO_NOT_FOUND"
        )
        }
      })

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

      if(setor === 'balcao') {
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

      const dados = {
        cliente: Number(cliente),
        formaPagamentoId: Number(formaPagamentoId),
        vendedor,
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
      next(error)
    }
  }
}

export { CriarPedidoControlador }

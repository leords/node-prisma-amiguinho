import {
  ERRO_MSG_AUTENTICADOR,
  ERRO_MSG_CLIENTE_DELIVERY,
  ERRO_MSG_CLIENTE_EXTERNO,
  ERRO_MSG_FORMA,
  ERRO_MSG_NIVEL_ACESSO,
  ERRO_MSG_PEDIDOS,
  ERRO_MSG_PRODUTO,
  ERRO_MSG_USUARIO,
  HTTP_STATUS_CODES,
  SUCESSO_MSG_CLIENTE_DELIVERY,
  SUCESSO_MSG_CLIENTE_EXTERNO,
  SUCESSO_MSG_FORMA,
  SUCESSO_MSG_NIVEL_ACESSO,
  SUCESSO_MSG_PEDIDOS,
  SUCESSO_MSG_PRODUTO,
  SUCESSO_MSG_USUARIO,
} from '../config/httpStatusCodes.js'

function coletarErro(error) {
  // Autenticador!!!
  if (error.message === ERRO_MSG_AUTENTICADOR.ACESSO_NEGADO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_AUTENTICADOR.ACESSO_NEGADO,
    }
  }

  // Modelo usuario!!!
  if (error.message === ERRO_MSG_USUARIO.USUARIO_JA_EXISTE) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.USUARIO_JA_EXISTE,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.VALIDAR_SENHA) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.VALIDAR_SENHA,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.OPCAO_NIVEL_ACESSO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.OPCAO_NIVEL_ACESSO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_NIVEL_ACESSO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_NIVEL_ACESSO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_SENHA) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_SENHA,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.VALIDAR_EMAIL) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.VALIDAR_EMAIL,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_EMAIL) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_EMAIL,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_NOME) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_NOME,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_USUARIO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_USUARIO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.ID_VAZIO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.ID_VAZIO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_STATUS) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_STATUS,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.CAMPO_AUSENTE) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.CAMPO_AUSENTE,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.USUARIO_INVALIDO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.USUARIO_INVALIDO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.DADOS_LOGIN_INCORRETOS) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.DADOS_LOGIN_INCORRETOS,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.USUARIO_NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.USUARIO_NAO_ENCONTRADO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.USUARIO_INATIVO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.USUARIO_INATIVO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TOKEN_SENHA_OBRIGATORIOS) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TOKEN_SENHA_OBRIGATORIOS,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TOKEN_INVALIDO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TOKEN_INVALIDO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.TOKEN_EXPIRADO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.TOKEN_EXPIRADO,
    }
  }
  if (error.message === ERRO_MSG_USUARIO.EMAIL_OBRIGADOTORIO) {
    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      mensagem: ERRO_MSG_USUARIO.EMAIL_OBRIGADOTORIO,
    }
  }
  if (error.message === SUCESSO_MSG_USUARIO.ALTERAR_USUARIO) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_USUARIO.ALTERAR_USUARIO,
    }
  }
  if (error.message === SUCESSO_MSG_USUARIO.CRIAR_USUARIO) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_USUARIO.CRIAR_USUARIO,
    }
  }
  if (error.message === SUCESSO_MSG_USUARIO.DELETAR_USUARIO) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_USUARIO.DELETAR_USUARIO,
    }
  }
  if (error.message === SUCESSO_MSG_USUARIO.VALIDAR_ENVIO_EMAIL) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_USUARIO.VALIDAR_ENVIO_EMAIL,
    }
  }
  if (error.message === SUCESSO_MSG_USUARIO.SENHA_REDEFINIDA) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_USUARIO.SENHA_REDEFINIDA,
    }
  }

  // Modelo clientes Delivery!!!
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.SINCRONIZACAO,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.TIPO_NOME) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.TIPO_NOME,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.TIPO_CIDADE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.TIPO_CIDADE,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.TIPO_BAIRRO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.TIPO_BAIRRO,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_DELIVERY.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_DELIVERY.NAO_ENCONTRADO,
    }
  }
  if (error.message === SUCESSO_MSG_CLIENTE_DELIVERY.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_CLIENTE_DELIVERY.SUCESSO_SINCRONIZACAO,
    }
  }

  // Modelo clientes Externo!!!
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.SINCRONIZACAO,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_NOME) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_NOME,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_CNPJ) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_CNPJ,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_CIDADE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_CIDADE,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_ENDERECO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_ENDERECO,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_VENDEDOR) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_VENDEDOR,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_ATENDIMENTO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_ATENDIMENTO,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.TIPO_FREQUENCIA) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.TIPO_FREQUENCIA,
    }
  }
  if (error.message === ERRO_MSG_CLIENTE_EXTERNO.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_CLIENTE_EXTERNO.NAO_ENCONTRADO,
    }
  }
  if (error.message === SUCESSO_MSG_CLIENTE_EXTERNO.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.OK,
      mensagem: SUCESSO_MSG_CLIENTE_EXTERNO.SINCRONIZACAO,
    }
  }

  // Modelo produtos!!!
  if (error.message === ERRO_MSG_PRODUTO.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.SINCRONIZACAO,
    }
  }
  if (error.message === ERRO_MSG_PRODUTO.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.NAO_ENCONTRADO,
    }
  }
  if (error.message === ERRO_MSG_PRODUTO.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_PRODUTO.TIPO_NOME) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.TIPO_NOME,
    }
  }
  if (error.message === ERRO_MSG_PRODUTO.TIPO_FORNECEDOR) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.TIPO_FORNECEDOR,
    }
  }
  if (error.message === ERRO_MSG_PRODUTO.TIPO_SEGMENTO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PRODUTO.TIPO_SEGMENTO,
    }
  }
  if (error.message === SUCESSO_MSG_PRODUTO.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: SUCESSO_MSG_PRODUTO.SINCRONIZACAO,
    }
  }

  // Modelo formas de pagamento!!!
  if (error.message === ERRO_MSG_FORMA.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_FORMA.SINCRONIZACAO,
    }
  }
  if (error.message === ERRO_MSG_FORMA.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_FORMA.NAO_ENCONTRADO,
    }
  }
  if (error.message === ERRO_MSG_FORMA.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_FORMA.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_FORMA.TIPO_STATUS) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_FORMA.TIPO_STATUS,
    }
  }
  if (error.message === ERRO_MSG_FORMA.TIPO_SOLICITANTE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_FORMA.TIPO_SOLICITANTE,
    }
  }
  if (error.message === SUCESSO_MSG_FORMA.SINCRONIZACAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: SUCESSO_MSG_FORMA.SINCRONIZACAO,
    }
  }

  // Modelo nivel de acesso!!!
  if (error.message === ERRO_MSG_NIVEL_ACESSO.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_NIVEL_ACESSO.NAO_ENCONTRADO,
    }
  }
  if (error.message === ERRO_MSG_NIVEL_ACESSO.NIVEL_JA_EXISTE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_NIVEL_ACESSO.NIVEL_JA_EXISTE,
    }
  }
  if (error.message === ERRO_MSG_NIVEL_ACESSO.CAMPO_AUSENTE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_NIVEL_ACESSO.CAMPO_AUSENTE,
    }
  }
  if (error.message === ERRO_MSG_NIVEL_ACESSO.TIPO_NOME) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_NIVEL_ACESSO.TIPO_NOME,
    }
  }
  if (error.message === SUCESSO_MSG_NIVEL_ACESSO.CRIADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: SUCESSO_MSG_NIVEL_ACESSO.CRIADO,
    }
  }

  // Modelo pedidos
  if (error.message === ERRO_MSG_PEDIDOS.NAO_ENCONTRADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.NAO_ENCONTRADO,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.TIPO_ID) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.TIPO_ID,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.TIPO_STATUS) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.TIPO_STATUS,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.LISTA_PEDIDOS) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.LISTA_PEDIDOS,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.SETOR) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.SETOR,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.CAMPO_AUSENTE) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.CAMPO_AUSENTE,
    }
  }
  if (error.message === ERRO_MSG_PEDIDOS.VENDEDOR_BALCAO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: ERRO_MSG_PEDIDOS.VENDEDOR_BALCAO,
    }
  }
  if (error.message === SUCESSO_MSG_PEDIDOS.CRIADO) {
    return {
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      mensagem: SUCESSO_MSG_PEDIDOS.CRIADO,
    }
  }

  return {
    status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    mensagem: 'Erro interno do servidor',
  }
}

export { coletarErro }

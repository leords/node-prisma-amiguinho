export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
}

// Autenticador !!!
export const ERRO_MSG_AUTENTICADOR = {
  TOKEN_AUSENTE: 'Token ausente',
  TOKEN_INVALIDO: 'Token inválido',
  ACESSO_NEGADO: 'Acesso negado, procure pelo administrador',
}

// Modelo usuario !!!
export const ERRO_MSG_USUARIO = {
  USUARIO_INVALIDO: 'Usuário não encontrado ou inativo',
  DADOS_LOGIN_INCORRETOS: 'Seu usuario ou senha estão incorretos',
  ERRO_INTERNO: 'Erro interno',
  CAMPO_AUSENTE: 'Favor preencher todos os campos',
  TIPO_ID: 'ID deve ser do tipo número',
  ID_VAZIO: 'ID não pode ser vazio',
  TIPO_STATUS: 'Status deve ser ATIVO ou INATIVO',
  TIPO_NOME: 'Nome deve ser do tipo texto',
  TIPO_EMAIL: 'Email deve ser do tipo texto',
  VALIDAR_EMAIL: 'Email inválido',
  TIPO_USUARIO: 'Usuário deve ser do tipo texto',
  TIPO_SENHA: 'Senha deve ser do tipo texto',
  TIPO_NIVEL_ACESSO: 'Nivel de acesso deve ser do tipo número',
  OPCAO_NIVEL_ACESSO: 'Apenas entre as opções 1 à 5.',
  VALIDAR_SENHA: 'Senha deve ter 6 digitos',
  USUARIO_JA_EXISTE: 'Este usuário já existe',
  //
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado',
  USUARIO_INATIVO: 'Usuário inativo',
  TOKEN_SENHA_OBRIGATORIOS: 'Token e senha são obrigatórios',
  TOKEN_INVALIDO: 'Token inválido',
  TOKEN_EXPIRADO: 'Token expirado',
  EMAIL_OBRIGADOTORIO: 'Email é obrigatório',
}
export const SUCESSO_MSG_USUARIO = {
  CRIAR_USUARIO: 'Usuário criado com sucesso',
  ALTERAR_USUARIO: 'Usuário atualizado com sucesso',
  DELETAR_USUARIO: 'Usuário excluído com sucesso',
  //
  VALIDAR_ENVIO_EMAIL:
    'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
  SENHA_REDEFINIDA: 'Senha redefinida com sucesso.',
}

// Modelo clientes Delivery !!!
export const ERRO_MSG_CLIENTE_DELIVERY = {
  SINCRONIZACAO: 'Erro ao sincronizar clientes delivery',

  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_NOME: 'Nome deve ser do tipo texto',
  TIPO_CIDADE: 'Cidade deve ser do tipo texto',
  TIPO_BAIRRO: 'Bairro deve ser do tipo texto',
  NAO_ENCONTRADO: 'Nenhum cliente delivery encontrado',
}
export const SUCESSO_MSG_CLIENTE_DELIVERY = {
  SINCRONIZACAO: 'Sincronização de clientes delivery realizada com sucesso',
}

// Modelo cliente Externo !!!
export const ERRO_MSG_CLIENTE_EXTERNO = {
  SINCRONIZACAO: 'Erro ao sincronizar clientes externo',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_NOME: 'Nome deve ser do tipo texto',
  TIPO_CNPJ: 'CNPJ deve ser do tipo texto',
  TIPO_CIDADE: 'Cidade deve ser do tipo texto',
  TIPO_ENDERECO: 'Endereço deve ser do tipo texto',
  TIPO_VENDEDOR: 'Vendedor deve ser do tipo texto',
  TIPO_ATENDIMENTO: 'Atendimento deve ser do tipo texto',
  TIPO_FREQUENCIA: 'Frequencia deve ser do tipo texto',
  NAO_ENCONTRADO: 'Nenhum cliente externo encontrado',
}
export const SUCESSO_MSG_CLIENTE_EXTERNO = {
  SINCRONIZACAO: 'Sincronização de clientes externo realizada com sucesso',
}

// Modelo produtos !!!
export const ERRO_MSG_PRODUTO = {
  SINCRONIZACAO: 'Erro ao sincronizar produtos',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_NOME: 'Nome deve ser do tipo texto',
  TIPO_FORNECEDOR: 'Fornecedor deve ser do tipo texto',
  TIPO_SEGMENTO: 'Segmento deve ser do tipo texto',
  NAO_ENCONTRADO: 'Nenhum produto encontrado',
}
export const SUCESSO_MSG_PRODUTO = {
  SINCRONIZACAO: 'Sincronização de produtos realizada com sucesso',
}

// Modelo formas de pagamento !!!
export const ERRO_MSG_FORMA = {
  SINCRONIZACAO: 'Erro ao sincronizar formas de pagamentos',
  NAO_ENCONTRADO: 'Nenhuma forma de pagamento encontrada',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_STATUS: 'Status deve ser ATIVO ou INATIVO',
  TIPO_SOLICITANTE: 'Solicitante deve ser Balcão ou Geral',
}
export const SUCESSO_MSG_FORMA = {
  SINCRONIZACAO: 'Sincronização de forma de pagamentos realizada com sucesso',
}

// Modelo nivel de acesso !!!
export const ERRO_MSG_NIVEL_ACESSO = {
  NAO_ENCONTRADO: 'Nenhum nível de acesso encontrado',
  NIVEL_JA_EXISTE: 'Este nível de acesso já existe',
  CAMPO_AUSENTE: 'Campo obrigatório ausente',
  TIPO_NOME: 'Nome deve ser do tipo texto',
}
export const SUCESSO_MSG_NIVEL_ACESSO = {
  CRIADO: 'Cadastro de nivel de acesso realizado com sucesso',
}

// Modelo pedidos !!!
export const ERRO_MSG_PEDIDOS = {
  NAO_ENCONTRADO: 'Nenhum pedido encontrado',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_STATUS: 'Status invalido. Use ativo ou inativo',
  LISTA_PEDIDOS: 'Lista de pedido é obrigatória',
  SETOR: 'Setor invalido. Use delivery, externo ou balcao',
  CAMPO_AUSENTE: 'Campo obrigatório ausente em algum item',
}
export const SUCESSO_MSG_PEDIDOS = {
  CRIADO: 'Pedido criado com sucesso',
}

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
  OPCAO_NIVEL_ACESSO:
    'Apenas entre as opções "ADMIN", "VENDAS", "BALCAO", "DELIVERY", "EXTERNO", "USUARIO"',
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
  VENDEDOR_BALCAO: 'Vendedor invalido. Use b1, b2 ou b3',
  JA_DEVOLVIDO: 'Este pedido já está marcado como devolvido',
  JA_CANCELADO: 'Este pedido já está cancelado',
  DATA_OBRIGATORIA: 'Data inicial e data final são obrigatórias para o relatório',
}
export const SUCESSO_MSG_PEDIDOS = {
  CRIADO: 'Pedido criado com sucesso',
  DEVOLVIDO: 'Pedido devolvido e estoque estornado com sucesso',
  RELATORIO_DEVOLUCOES: 'Relatório de devoluções gerado com sucesso',
}

// Modelo Motorista !!!
export const ERRO_MSG_MOTORISTA = {
  NAO_ENCONTRADO: 'Motorista não encontrado',
  CPF_JA_EXISTE: 'Já existe um motorista cadastrado com este CPF',
  CAMPO_AUSENTE: 'Nome e CPF são campos obrigatórios',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_STATUS: 'Status deve ser booleano (true ou false)',
}
export const SUCESSO_MSG_MOTORISTA = {
  CRIADO: 'Motorista cadastrado com sucesso',
  ATUALIZADO: 'Motorista atualizado com sucesso',
}

// Modelo Veículo !!!
export const ERRO_MSG_VEICULO = {
  NAO_ENCONTRADO: 'Veículo não encontrado',
  PLACA_JA_EXISTE: 'Já existe um veículo cadastrado com esta placa',
  CAMPO_AUSENTE: 'Nome, modelo, marca, placa e peso máximo são obrigatórios',
  TIPO_ID: 'ID deve ser do tipo número',
  TIPO_STATUS: 'Status deve ser booleano (true ou false)',
  TIPO_EM_ROTA: 'Em rota deve ser booleano (true ou false)',
}
export const SUCESSO_MSG_VEICULO = {
  CRIADO: 'Veículo cadastrado com sucesso',
  ATUALIZADO: 'Veículo atualizado com sucesso',
}

// Modelo Carga !!!
export const ERRO_MSG_CARGA = {
  NAO_ENCONTRADO: 'Carga não encontrada',
  CAMPO_AUSENTE: 'Veículo, motorista e lista de pedidos são obrigatórios',
  TIPO_ID: 'ID deve ser do tipo número',
  VEICULO_INATIVO: 'O veículo selecionado está inativo',
  MOTORISTA_INATIVO: 'O motorista selecionado está inativo',
  SEM_PEDIDOS: 'A carga precisa conter ao menos um pedido externo',
  PEDIDO_NAO_ENCONTRADO: 'Um ou mais pedidos informados não foram encontrados',
  PEDIDO_JA_EM_CARGA: 'Um ou mais pedidos já estão vinculados a outra carga',
  PEDIDO_NAO_PERTENCE_CARGA: 'O pedido informado não pertence a esta carga',
  CARGA_JA_EM_ROTA_OU_FINALIZADA:
    'Esta carga já está em rota ou finalizada e não pode ser alterada.',
  CARGA_NAO_PODE_RECEBER_PEDIDOS:
    'Esta carga já está em rota ou finalizada e não pode receber novos pedidos.',
  CARGA_NAO_PODE_SER_CANCELADA:
    'Esta carga já está em rota ou finalizada e não pode ser cancelada.',
  CARGA_NAO_PENDENTE:
    'Apenas cargas com status pendente podem ser enviadas para rota.',
  CARGA_JA_FINALIZADA: 'Esta carga já está em rota ou finalizada',
  NAO_PODE_REABRIR_FINALIZADA:
    'Não é possível reabrir uma carga já finalizada.',
  STATUS_INVALIDO:
    'Status de carga inválido. Permitidos: pendente, rota, finalizada',
}
export const SUCESSO_MSG_CARGA = {
  CRIADO: 'Carga criada com sucesso',
  FINALIZADA: 'Carga despachada para rota com sucesso',
  PEDIDO_REMOVIDO: 'Pedido removido da carga com sucesso',
  PEDIDOS_ADICIONADOS: 'Pedidos adicionados à carga com sucesso',
  CANCELADA: 'Carga cancelada e pedidos devolvidos para pendente',
  RETORNADA_PENDENTE: 'Carga retornada para o status pendente com sucesso',
  CONCLUIDA: 'Carga finalizada com sucesso',
}

// Modelo Pendências !!!
export const ERRO_MSG_PENDENCIA = {
  NAO_ENCONTRADO: 'Pendência não encontrada',
  TIPO_ID: 'ID deve ser do tipo número',
  STATUS_INVALIDO: 'Status de pendência inválido',
}
export const SUCESSO_MSG_PENDENCIA = {
  CRIADO: 'Pendência criada com sucesso',
  ATUALIZADO: 'Pendência atualizada com sucesso',
}

// Modelo Pagamento !!!
export const ERRO_MSG_PAGAMENTO = {
  NAO_ENCONTRADO: 'Pagamento não encontrado',
  CAMPO_AUSENTE: 'Pendência e valor do pagamento são obrigatórios',
  VALOR_INVALIDO: 'Valor do pagamento deve ser maior que zero',
  VALOR_EXCEDE_PENDENCIA: 'Valor do pagamento excede o saldo devedor da pendência',
  TIPO_ID: 'ID deve ser do tipo número',
}
export const SUCESSO_MSG_PAGAMENTO = {
  CRIADO: 'Pagamento registrado com sucesso',
  ATUALIZADO: 'Pagamento atualizado com sucesso',
}

// Modelo Localização !!!
export const ERRO_MSG_LOCALIZACAO = {
  NAO_ENCONTRADO: 'Nenhuma localização encontrada para os filtros informados',
  DATA_OBRIGATORIA: 'A data é obrigatória para consultar a rota',
  USUARIO_OBRIGATORIO: 'O ID do usuário é obrigatório',
  TIPO_ID: 'ID deve ser do tipo número',
  FORMATO_DATA_INVALIDO: 'Formato de data inválido. Use YYYY-MM-DD',
}
export const SUCESSO_MSG_LOCALIZACAO = {
  LISTADO: 'Rotas e localizações listadas com sucesso',
  CRIADO: 'Localização registrada com sucesso',
}
// Modelo Desconto !!!
export const ERRO_MSG_DESCONTO = {
  PRODUTO_NAO_ENCONTRADO: "Produto 'DESCONTO' não encontrado no sistema",
  SETOR_INVALIDO:
    'Setor inválido. Use balcao, delivery, externo ou deixe vazio para todos',
  DATA_INVALIDA: 'Formato de data inválido. Use YYYY-MM-DD',
}
export const SUCESSO_MSG_DESCONTO = {
  METRICAS: 'Métricas de desconto calculadas com sucesso',
  LISTADO: 'Relatório de pedidos com desconto listado com sucesso',
}

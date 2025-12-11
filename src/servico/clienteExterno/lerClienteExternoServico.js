import { ERRO_MSG_CLIENTE_EXTERNO } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class LerClienteExternoServico {
  async executar(filtros) {
    const condicoes = {}

    if (filtros.id) {
      condicoes.id = Number(filtros.id)
    }
    if (filtros.nome) {
      condicoes.nome = filtros.nome.toUpperCase()
    }
    if (filtros.cidade) {
      condicoes.cidade = filtros.cidade.toUpperCase()
    }
    if (filtros.cnpj) {
      condicoes.cnpj = filtros.cnpj.toUpperCase()
    }
    if (filtros.endereco) {
      condicoes.endereco = filtros.endereco.toUpperCase()
    }
    if (filtros.vendedor) {
      condicoes.vendedor = filtros.vendedor.toUpperCase()
    }
    if (filtros.atendimento) {
      condicoes.atendimento = filtros.atendimento.toUpperCase()
    }
    if (filtros.frequencia) {
      condicoes.frequencia = filtros.frequencia.toUpperCase()
    }
    try {
      const clientes = await prismaCliente.clienteExterno.findMany({
        where: condicoes,
      })

      if (!clientes) {
        throw new Error(ERRO_MSG_CLIENTE_EXTERNO.NAO_ENCONTRADO)
      }

      return clientes
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { LerClienteExternoServico }

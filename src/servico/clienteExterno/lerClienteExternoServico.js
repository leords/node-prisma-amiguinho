import {
  ERRO_MSG_CLIENTE_EXTERNO,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'
import { AppError } from '../../error/appError.js'
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
      condicoes.vendedor = {
        contains: filtros.vendedor.toUpperCase(),
        mode: 'insensitive',
      }
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
        include: {
          pendencias: {
            where: {
              status: { notIn: ['cancelada'] },
            },
            include: {
              pagamentos: true,
            },
          },
        },
      })

      if (!clientes) {
        throw new AppError(
          ERRO_MSG_CLIENTE_EXTERNO.NAO_ENCONTRADO,
          HTTP_STATUS_CODES.NOT_FOUND,
          'CLIENTES_NOT_FOUND'
        )
      }

      const clientesFormatados = clientes.map((c) => {
        const pendenciasAtivas = (c.pendencias || []).filter(
          (p) => p.status !== 'fechada' && p.status !== 'cancelada'
        )

        const totalPendenciaOriginal = pendenciasAtivas.reduce(
          (acc, p) => acc + Number(p.valor || 0),
          0
        )
        const totalPago = pendenciasAtivas.reduce(
          (acc, p) => acc + Number(p.valorPago || 0),
          0
        )
        const totalSaldoDevedor = Number(
          Math.max(0, totalPendenciaOriginal - totalPago).toFixed(2)
        )

        return {
          ...c,
          totalPendenciaOriginal: Number(totalPendenciaOriginal.toFixed(2)),
          totalPendencia: totalSaldoDevedor,
          totalPago: Number(totalPago.toFixed(2)),
          temPendencia: totalSaldoDevedor > 0,
        }
      })

      return clientesFormatados
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export { LerClienteExternoServico }

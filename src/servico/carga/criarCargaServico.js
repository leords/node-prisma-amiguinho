import prismaCliente from '../../prisma/index.js'
import { AppError } from '../../error/appError.js'
import {
  ERRO_MSG_CARGA,
  HTTP_STATUS_CODES,
} from '../../config/httpStatusCodes.js'

class CriarCargaServico {
  async executar({
    veiculoId,
    motoristaId,
    descricao,
    destino,
    pedidosIds,
    usuarioId,
  }) {
    const idVeiculo = Number(veiculoId)
    const idMotorista = Number(motoristaId)
    const idUsuario = Number(usuarioId)

    if (isNaN(idVeiculo) || isNaN(idMotorista) || isNaN(idUsuario)) {
      throw new AppError(
        ERRO_MSG_CARGA.CAMPO_AUSENTE,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'CAMPO_AUSENTE'
      )
    }

    if (!Array.isArray(pedidosIds) || pedidosIds.length === 0) {
      throw new AppError(
        ERRO_MSG_CARGA.SEM_PEDIDOS,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'SEM_PEDIDOS'
      )
    }

    const idsFormatados = pedidosIds.map(Number).filter((id) => !isNaN(id))
    if (idsFormatados.length === 0) {
      throw new AppError(
        ERRO_MSG_CARGA.SEM_PEDIDOS,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'SEM_PEDIDOS'
      )
    }

    // Valida se o veículo existe e está ativo
    const veiculo = await prismaCliente.veiculo.findUnique({
      where: { id: idVeiculo },
    })

    if (!veiculo) {
      throw new AppError(
        'Veículo não encontrado',
        HTTP_STATUS_CODES.NOT_FOUND,
        'VEICULO_NOT_FOUND'
      )
    }

    if (!veiculo.status) {
      throw new AppError(
        ERRO_MSG_CARGA.VEICULO_INATIVO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'VEICULO_INATIVO'
      )
    }

    // Valida se o motorista existe e está ativo
    const motorista = await prismaCliente.motorista.findUnique({
      where: { id: idMotorista },
    })

    if (!motorista) {
      throw new AppError(
        'Motorista não encontrado',
        HTTP_STATUS_CODES.NOT_FOUND,
        'MOTORISTA_NOT_FOUND'
      )
    }

    if (!motorista.status) {
      throw new AppError(
        ERRO_MSG_CARGA.MOTORISTA_INATIVO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'MOTORISTA_INATIVO'
      )
    }

    // Busca todos os pedidos externos informados
    const pedidos = await prismaCliente.pedidoExterno.findMany({
      where: {
        id: { in: idsFormatados },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    if (pedidos.length !== idsFormatados.length) {
      throw new AppError(
        ERRO_MSG_CARGA.PEDIDO_NAO_ENCONTRADO,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_NAO_ENCONTRADO'
      )
    }

    // Valida se algum pedido já está alocado em outra carga
    const pedidosJaEmCarga = pedidos.filter((p) => p.cargaId !== null)
    if (pedidosJaEmCarga.length > 0) {
      const idsConflito = pedidosJaEmCarga.map((p) => p.id).join(', ')
      throw new AppError(
        `${ERRO_MSG_CARGA.PEDIDO_JA_EM_CARGA} (IDs: ${idsConflito})`,
        HTTP_STATUS_CODES.BAD_REQUEST,
        'PEDIDO_JA_EM_CARGA'
      )
    }

    // Cálculo do peso total baseado nos produtos de cada pedido
    let pesoTotal = 0
    for (const pedido of pedidos) {
      for (const item of pedido.itens) {
        const pesoUnitario = item.produto?.peso ? Number(item.produto.peso) : 0
        pesoTotal += Number(item.quantidade) * pesoUnitario
      }
    }

    const quantidadePedidos = pedidos.length

    // Criação da carga e vinculação dos pedidos em transação atômica
    const cargaCriada = await prismaCliente.$transaction(async (prisma) => {
      const carga = await prisma.carga.create({
        data: {
          veiculoId: idVeiculo,
          motoristaId: idMotorista,
          usuarioId: idUsuario,
          descricao: descricao ? String(descricao).trim() : null,
          destino: destino ? String(destino).trim() : null,
          peso: Number(pesoTotal.toFixed(2)),
          quantidadePedido: quantidadePedidos,
          status: 'pendente',
        },
      })

      // Vincula todos os pedidos à carga recém-criada e atualiza status para 'carregado'
      await prisma.pedidoExterno.updateMany({
        where: {
          id: { in: idsFormatados },
        },
        data: {
          cargaId: carga.id,
          status: 'carregado',
        },
      })

      return await prisma.carga.findUnique({
        where: { id: carga.id },
        include: {
          veiculo: true,
          motorista: true,
          usuario: {
            select: { id: true, nome: true, usuario: true },
          },
          pedidos: {
            include: {
              cliente: true,
              formaPagamento: true,
              itens: {
                include: {
                  produto: true,
                },
              },
            },
          },
        },
      })
    })

    return cargaCriada
  }
}

export { CriarCargaServico }

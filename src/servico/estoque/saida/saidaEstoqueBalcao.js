import { HTTP_STATUS_CODES } from "../../../config/httpStatusCodes.js";
import { AppError } from "../../../error/appError.js";

class SaidaEstoqueBalcao {
  async executar(pedidoId, prisma) {
    
    const pedido = await prisma.pedidoBalcao.findUnique({
      where: { id: pedidoId },
      include: { itens: true }
    });

    // valida existencia do pedido
    if (!pedido) {
      throw new AppError(
        "Pedido não encontrado",
        HTTP_STATUS_CODES.NOT_FOUND,
        "PEDIDO_NOT_FOUND"
      );
    }

    // valida se o mesmo ja foi carregado
    if (pedido.status === "finalizado") {
      throw new AppError(
        "Pedido já processado",
        HTTP_STATUS_CODES.NOT_FOUND,
        "PEDIDO_NOT_FOUND"
      );
    }

    // busca todos os produtos de uma vez
    const produtos = await prisma.produto.findMany({
      where: {
        id: {
          in: pedido.itens.map((item) => item.produtoId)
        }
      }
    });

    for (const item of pedido.itens) {

      // busca produto em memória
      const produto = produtos.find(
        (p) => p.id === item.produtoId
      );

      // valida existencia do produto
      if (!produto) {
        throw new AppError(
          `Produto não encontrado: ${item.produtoId}`,
          HTTP_STATUS_CODES.NOT_FOUND,
          "PRODUTO_NOT_FOUND"
        );
      }

      // valida quantidade por embalagem
      if (!produto.quantidade || produto.quantidade <= 0) {
        throw new AppError(
          `Quantidade por embalagem inválida do produto: ${produto.nome}`,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "QUANTIDADE_INVALIDA"
        );
      }

      // transformando UND em caixa
      const quantidadeTransformada =
        item.quantidade / produto.quantidade;

      // verifica quantidade em estoque
      if (produto.estoque < quantidadeTransformada) {
        throw new AppError(
          `Estoque insuficiente do produto: ${produto.nome}`,
          HTTP_STATUS_CODES.BAD_REQUEST,
          "QUANTIDADE_NOT_FOUND"
        );
      }

      // cria movimentação
      await prisma.estoque.create({
        data: {
          produto: {
            connect: { id: item.produtoId }
          },
          tipo: "SAIDA",
          quantidade: -quantidadeTransformada,
          origem: pedido.tipo,
          origemId: pedido.id,
          usuario: {
            connect: { id: pedido.usuarioId }
          }
        }
      });

      // atualiza estoque do produto
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            decrement: quantidadeTransformada
          }
        }
      });
    }

    // atualiza status do pedido
    return await prisma.pedidoBalcao.update({
      where: { id: pedidoId },
      data: { status: "finalizado" }
    });
  }
}

export { SaidaEstoqueBalcao };
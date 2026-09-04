import { HTTP_STATUS_CODES } from '../../config/httpStatusCodes.js'
import prismaCliente from '../../prisma/index.js'

class EditarFechamentoServico {
  async executar(id, dados, notas) {
    const { totalSistema, totalInformado } = dados
    const { nota200, nota100, nota50, nota20, nota10, nota5, nota2 } = notas

    const existeFechamento = await prismaCliente.fechamento.findFirst({
      where: {
        id,
      },
    })

    if (!existeFechamento) {
      return null
    }

    if (totalSistema == null || totalInformado == null) {
      throw new AppError(
        'Valores obrigatórios não informados',
        HTTP_STATUS_CODES.BAD_REQUEST,
        'FECHAMENTO_VALOR_BAD_REQUEST'
      )
    }

    const diferenca = totalInformado - totalSistema

    const resultado = await prismaCliente.fechamento.update({
      where: {
        id,
      },
      data: {
        status: 'fechado',
        totalSistema,
        totalInformado,
        diferenca,
        nota200,
        nota100,
        nota50,
        nota20,
        nota10,
        nota5,
        nota2,
        dia: new Date().toISOString().split('T')[0],
      },
    })

    return resultado
  }
}

export { EditarFechamentoServico }

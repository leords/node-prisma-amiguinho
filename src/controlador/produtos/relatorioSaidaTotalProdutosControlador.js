import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { RelatorioSTPServico } from "../../servico/produtos/relatorioSTPServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"


class RelatorioSTPControlador {
    async tratar(req, res, next) {

        const setor = req.params.setor
        const produtoId = req.query.produtoId ? Number(req.query.produtoId): undefined
        const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
        const dataFim = req.query.dataFim ? req.query.dataFim : undefined

        try {

            const opcaoSetores = ['balcao', 'delivery', 'externo', 'geral']
            if (setor && !opcaoSetores.includes(setor)) {
                throw new AppError(
                    'Setor inválido',
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "SETOR_NOT_FOUND"
                )
            }

            if(produtoId && isNaN(produtoId)) {
                throw new AppError(
                    'Produto deve um número',
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "PRODUTO_NOT_FOUND"
                )
            }

            if (typeof dataInicio !== 'string' && typeof dataFim !== 'string') {
                throw new AppError(
                    'Data de fim deve ser texto',
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DATA_INICIO_NOT_FOUND"
                )
            }

            const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
            const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

            const servico = new RelatorioSTPServico()
            const resultado = await servico.executar(setor, inicio, fim, produtoId)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado);
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { RelatorioSTPControlador }
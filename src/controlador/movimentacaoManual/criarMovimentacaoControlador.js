import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { CriarMovimentacaoServico } from "../../servico/movimentacaoManual/criarMovimentacaoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class CriarMovimentacaoControlador {
    async tratar(req, res, next) {
        const { fechamentoId, tipo, descricao, valor } = req.body

        try {

            if(!fechamentoId) {
                throw new AppError(
                    "Fechamento ID é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FECHAMENTO_ID_NOT_FOUND"
                )
            }
            if(isNaN(fechamentoId)) {
                throw new AppError(
                    "Fechamento ID deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FECHAMENTO_ID_NOT_FOUND"
                )
            }

            if(!tipo) {
                throw new AppError(
                    "Tipo é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_NOT_FOUND"
                )
            }
            const opcoesTipo = ['entrada', 'saida']
            if(!opcoesTipo.includes(tipo)) {
                throw new AppError(
                    "Tipo deve ser entrada ou saida",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_NOT_FOUND"
                )
            }

            if(!descricao) {
                throw new AppError(
                    "Descrição é obrigatória",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DESCRICAO_NOT_FOUND"
                )
            }
            if(typeof descricao !== 'string') {
                throw new AppError(
                    "Descrição deve ser uma string",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DESCRICAO_NOT_FOUND"
                )
            }

            if(!valor) {
                throw new AppError(
                    "Valor é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FECHAMENTO_ID_NOT_FOUND"
                )
            }
            if(isNaN(valor)) {
                throw new AppError(
                    "'Valor deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FECHAMENTO_ID_NOT_FOUND"
                )
            }

            const resultado = new CriarMovimentacaoServico();
            const servico = await resultado.executar(fechamentoId, tipo, descricao, valor);

            return res.status(HTTP_STATUS_CODES.CREATED).json(servico)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}


export { CriarMovimentacaoControlador }
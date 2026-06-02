import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { CriarFechamentoServico } from "../../servico/fechamento/criarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"


class CriarFechamentoControlador {
    async tratar(req, res, next) {
        const { setor } = req.params
        const { vendedor } = req.body

        try {
            if(!setor) {
                throw new AppError(
                    "Setor é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "SETOR_BAD_REQUEST"
                )
            }

            if(typeof setor !== 'string') {
                throw new AppError(
                    "Setor deve ser texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "SETOR_BAD_REQUEST"
                )
            }
            const opcoesSetor = ['delivery', 'externo', 'balcao']
            if(!opcoesSetor.includes(setor)) {
                throw new AppError(
                    "Setor inválido",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "SETOR_BAD_REQUEST"
                )
            }

            if(!vendedor) { 
                throw new AppError(
                    "Vendedor é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VENDEDOR_BAD_REQUEST"
                )
            }
            if(typeof vendedor !== 'string') {
                throw new AppError(
                    "Vendedor deve ser texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VENDEDOR_BAD_REQUEST"
                )
            }

            const servico = new CriarFechamentoServico()
            const resultado = await servico.executar(setor, vendedor )

            return res.status(HTTP_STATUS_CODES.CREATED).json(resultado)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { CriarFechamentoControlador }
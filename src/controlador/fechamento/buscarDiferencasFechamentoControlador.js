import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { BuscarDiferencasFechamentoService } from "../../servico/fechamento/buscarDiferencasFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"
import { AppError } from '../../error/appError.js'


class BuscarDiferencasFechamentoControlador {
    async tratar(req, res, next) {

        const { setor } = req.params
        const dataInicio = req.query.dataInicio ? req.query.dataInicio : undefined
        const dataFim = req.query.dataFim ? req.query.dataFim : undefined
        const vendedor = req.query.vendedor ? req.query.vendedor : undefined



        try {
            if(dataInicio && typeof dataInicio === 'string') {
                throw new AppError(
                    "Data de início deve ser um texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DATA_INICIO_BAD_REQUEST"
                )
            }
            if(dataFim && typeof dataFim === 'string') {
                throw new AppError(
                    "Data de fim deve ser um texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DATA_FIM_BAD_REQUEST"
                )
            }
            if(vendedor && typeof vendedor !== 'string') {
                throw new AppError(
                    "ndedor deve ser texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "VENDEDOR_BAD_REQUEST"
                ) 
            }

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

            const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
            const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined

            const servico = new BuscarDiferencasFechamentoService()
            const resultado = await servico.executar(setor, inicio, fim, vendedor) 

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { BuscarDiferencasFechamentoControlador }
import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { BuscarFechamentoServico } from "../../servico/fechamento/buscarFechamentoServico.js"
import { coletarErro } from "../../utilidades/coletarErro.js"

class BuscarFechamentoControlador { 
    async tratar(req, res, next) {

        const { setor } = req.params
        const vendedor = req.query.vendedor ? req.query.vendedor : undefined
        const data = req.query.data ? req.query.data : undefined

        try {
            if(vendedor && typeof vendedor !== 'string') {
                throw new AppError(
                    "Vendedor deve ser texto",
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
            
            if(data && typeof data !== 'string') {
                throw new AppError(
                    "Data deve ser texto",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "DATA_BAD_REQUEST"
                )
            }

            const dataInicio = data ? new Date(`${data}T00:00:00-03:00`) : undefined
            const dataFim = data ? new Date(`${data}T23:59:59.999-03:00`) : undefined

            const resultado = new BuscarFechamentoServico();
            const servico = await resultado.executar(vendedor, setor, dataInicio, dataFim);

            return res.status(HTTP_STATUS_CODES.OK).json(servico)

        } catch (error) {
            console.log(error)
            next(error)
        }   
    }
}

export { BuscarFechamentoControlador }
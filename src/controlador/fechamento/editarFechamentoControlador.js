import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { EditarFechamentoServico } from "../../servico/fechamento/editarFechamentoServico.js"
import { AppError } from "../../error/appError.js"


class EditarFechamentoControlador {
    async tratar(req, res, next) {
        const  id  = Number(req.params.id)
        const {totalSistema, totalInformado} = req.body

        try {
            if(!id) {
                throw new AppError(
                    "Id é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }
            if(isNaN(id)) {
                throw new AppError(
                    "Id deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_ID_BAD_REQUEST"
                )
            }
            
            if(totalSistema == null || totalInformado == undefined) {
                throw new AppError(
                    "Total do sistema é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TOTAL_SISTEMA_BAD_REQUEST"
                )
            }
            if(isNaN(totalSistema)) {
                throw new AppError(
                    "Total do sistema deve ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TOTAL_SISTEMA_BAD_REQUEST"
                )
            }

            if(!totalInformado) {
                throw new AppError(
                    "Total informado é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TOTAL_INFORMADO_BAD_REQUEST"
                )
            }
            if(isNaN(totalInformado)) {
                throw new AppError(
                    "Total informado de ser um número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TOTAL_INFORMADO_BAD_REQUEST"
                )
            }

            const dados = {
                totalSistema: totalSistema,
                totalInformado: totalInformado,
            }

            const resultado = new EditarFechamentoServico()
            const servico = await resultado.executar(id, dados)

            return res.status(HTTP_STATUS_CODES.OK).json(servico)

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { EditarFechamentoControlador }

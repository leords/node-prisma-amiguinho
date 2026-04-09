import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { EditarOrdemCompraServico } from "../../servico/ordemCompra/editarOrdemCompraServico.js"


class EditarOrdemCompraControlador {
    async tratar(req, res, next) {
        const id = Number(req.params.id)
        const status = req.body.status
        const usuarioId = req.body.usuarioId

        try {

            if(!id) {
                throw new AppError (
                    "Id é obrigatório",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }

            if(isNaN(id)) {
                throw new AppError (
                    "Id precisa ser do tipo número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_ID_BAD_REQUEST"
                )
            }
            
            const opcaoStatus = ['Realizada', 'Cancelada', 'Finalizada' ]
            console.log(status)

            if(!opcaoStatus.includes(status)) {
                    throw new AppError (
                    "Status precisa ser uma das opções: Realizada, Cancelada ou Finalizada",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "STATUS_BAD_REQUEST"
                )
            }

            if(!usuarioId) {
                throw new AppError (
                    "usuarioId é obrigatorio",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "USUARIO_ID_BAD_REQUEST"
                )
            }
            if(isNaN(usuarioId)) {
                throw new AppError (
                    "Id precisa ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "TIPO_USUARIO_ID_BAD_REQUEST"
                )
            }

            const servico = new EditarOrdemCompraServico()
            const resultado = await servico.executar(id, status, usuarioId)

            if(!resultado) {
                throw new AppError(
                    "Não foi possivel alterar está ordem de serviço",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ERRO_EDITAR_BAD_REQUEST"
                )
            }

            return res.status(HTTP_STATUS_CODES.OK).json(resultado);

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { EditarOrdemCompraControlador }
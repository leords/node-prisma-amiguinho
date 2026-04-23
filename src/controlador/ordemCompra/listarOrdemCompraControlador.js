

import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js"
import { AppError } from "../../error/appError.js"
import { ListarOrdemCompraServico } from "../../servico/ordemCompra/listarOrdemCompraServico.js"


class ListarOrdemCompraControlador {
    async tratar(req, res, next) {
        // id, data, usuarioId, fornecedorId, status
        const id = req.query.id ? Number(req.query.id) : undefined
        const dataInicio = req.query.dataInicio
        const dataFim = req.query.dataFim
        const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined
        const fornecedorId = req.query.fornecedorId ? Number(req.query.fornecedorId) : undefined
        const status = req.query.status ? req.query.status : undefined 

        console.log(fornecedorId)

        try {
            if(id && isNaN(id)) {
                throw new AppError (
                    "Id precisa ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "ID_BAD_REQUEST"
                )
            }
            if(usuarioId && isNaN(usuarioId)) {
                throw new AppError (
                    "usuarioId precisa ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "USUARIO_ID_BAD_REQUEST"
                )
            }
            if(fornecedorId && isNaN(fornecedorId)) {
                throw new AppError (
                    "fornecedorId precisa ser número",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "FUNCIONARIO_ID_BAD_REQUEST"
                )
            }

            const opcaoStatus = ['Realizada', 'Cancelada', 'Finalizada', 'Pendente' ]
            if(status && !opcaoStatus.includes(status)) {
                    throw new AppError (
                    "Status precisa ser uma das opções: Realizada, Cancelada, Finalizada, Pendente",
                    HTTP_STATUS_CODES.BAD_REQUEST,
                    "STATUS_BAD_REQUEST"
                )
            }

            // transformo elas em ISO manualmente. desta forma consigo pegar o intervalo do dia inteiro.
            const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00-03:00`) : undefined
            const fim = dataFim ? new Date(`${dataFim}T23:59:59.999-03:00`) : undefined
            
            const servico = new ListarOrdemCompraServico()
            const resultado = await servico.executar(id, usuarioId, fornecedorId, status, inicio, fim)

            return res.status(HTTP_STATUS_CODES.OK).json(resultado)
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export { ListarOrdemCompraControlador }
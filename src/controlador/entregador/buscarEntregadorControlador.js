import { HTTP_STATUS_CODES } from "../../config/httpStatusCodes.js";
import { entregadores } from "../../socket/conexoes.js"

class buscarEntregadorControlador {
    async tratar(req, res, next) {

        // pegando o id de usuario que fez a REQ
        const painelId = req.user.id

        console.log('painelID: ', painelId)

        // pegando o id do usuario do app
        const entregadorId = Number(req.body.entregadorId)

        // Busco em conexoes se tem conexao em aberto com id
        const socketEntregador = entregadores.get(entregadorId);

        if(!socketEntregador) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                erro: "Entregador offline"
            })
        }

        // envio junto o id do usuario do painel
        socketEntregador.emit("solicitar_localizacao", { painelId });

        return res.json({
            mensagem: "Solicitação enviada"
        });
    }
}


export { buscarEntregadorControlador }
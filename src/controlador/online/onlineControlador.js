
class OnlineControlador {
    async tratar(req, res) {
        return res.status(200).json({
            status: 'ok',
            mensagem: 'Servidor conectado com sucesso'
        });
    }
}

export { OnlineControlador }
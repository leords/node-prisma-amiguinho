import prismaCliente from "../../prisma/index.js"

class criarLocalizacaoPedidoServico {
    async executar(localizacoes) {
        
        //uuid, data, latitude, longitude, precisao, origem, usuarioId, clienteId

        return await prismaCliente.localizacao.createMany({
            
                data: localizacoes.map((localizacao) => ({
                    data: new Date(localizacao.data),
                    latitude: localizacao.latitude,
                    longitude: localizacao.longitude,
                    precisao: localizacao.precisao,
                    origem: localizacao.origem,
                    usuarioId: localizacao.usuarioId,
                    clienteId: localizacao.clienteId
                }))
            });
        }
    }


export { criarLocalizacaoPedidoServico }
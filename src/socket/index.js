import { paineis, entregadores } from './conexoes.js'

export default function configurarSocket(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    socket.on('registrar', ({ tipo, usuarioId }) => {
      const id = String(usuarioId)

      if (tipo === 'painel') {
        const socketAntigo = paineis.get(id)
        if (socketAntigo && socketAntigo.id !== socket.id) {
          socketAntigo.disconnect(true)
        }
        paineis.set(id, socket)
      } else if (tipo === 'entregador') {
        const socketAntigo = entregadores.get(id)
        if (socketAntigo && socketAntigo.id !== socket.id) {
          socketAntigo.disconnect(true)
        }
        entregadores.set(id, socket)
      } else {
        return
      }

      console.log('Entradas paineis:', [...paineis.keys()])
      console.log('Entradas entregadores:', [...entregadores.keys()])
    })

    // PAINEL pede localização
    socket.on('solicitar_localizacao', ({ entregadorId }) => {
      const entregador = entregadores.get(String(entregadorId))

      if (!entregador) {
        console.log('❌ ENTREGADOR NÃO ENCONTRADO:', entregadorId)
        return
      }

      entregador.emit('solicitar_localizacao')
    })

    // APP responde localização
    socket.on('resposta_localizacao', (dados) => {
      const { entregadorId, latitude, longitude } = dados
      console.log('Dados -> ', dados)

      if (latitude == null || longitude == null) {
        console.log('⚠️ Dados incompletos recebidos:', dados)
        return
      }

      //const socketPainel = paineis.get(1);
      // pega o unico painel registrado
      const socketPainel = paineis.values().next().value

      if (!socketPainel) {
        console.log('❌ PAINEL NÃO ENCONTRADO:', painelId)
        return
      }

      console.log('🖥️ PAINEL ENCONTRADO:', socketPainel.id)

      socketPainel.emit('localizacao_recebida', {
        entregadorId,
        latitude,
        longitude,
        timestamp: Date.now(),
      })
    })

    // Desconectando
    // limpar os dois maps!
    socket.on('disconnect', () => {
      for (const [id, socketConexao] of entregadores) {
        if (socketConexao.id === socket.id) {
          entregadores.delete(id)
          break
        }
      }

      for (const [id, socketConexao] of paineis) {
        if (socketConexao.id === socket.id) {
          paineis.delete(id)
          break
        }
      }

      console.log('Cliente desconectado:', socket.id)
    })
  })
}

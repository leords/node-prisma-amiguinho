import { paineis, entregadores } from "./conexoes.js";

export default function configurarSocket(io) {

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("registrar", ({ tipo, usuarioId }) => {

      if(tipo === 'painel') {
          paineis.set(usuarioId, socket);
      } 
      else if(tipo === 'entregador') {
          entregadores.set(usuarioId, socket);
      } 
      else {
        return;
      }

      console.log("Entradas paineis:", [...paineis.entries()]);
      console.log("Entradas entregadores:", [...entregadores.entries()]);
    });

    
    // PAINEL pede localização
    socket.on("solicitar_localizacao", ({ entregadorId }) => {

      const entregador = entregadores.get(entregadorId);

      if (!entregador) return;

      entregador.emit("solicitar_localizacao");

    });

    // APP responde localização
    socket.on("resposta_localizacao", (dados) => {

      const socketPainel = paineis.get(dados.painelId)

      console.log(typeof dados.painelId)
      console.log('ID: ', dados.painelId)

      if (!socketPainel) {
        console.log("❌ PAINEL NÃO ENCONTRADO");
        return;
      }

      console.log("🖥️ PAINEL ENCONTRADO:", socketPainel.id);

      socketPainel.emit("localizacao_recebida", dados);

    });

    // Desconectando 
    // limpar os dois mapss!
    socket.on("disconnect", () => {

      for (const [id, socketConexao] of entregadores) {

        if (socketConexao.id === socket.id) {
          entregadores.delete(id);
          break;
        }

      }

      for (const [id, socketConexao] of paineis) {

        if (socketConexao.id === socket.id) {
          paineis.delete(id);
          break;
        }

      }

    });

  });

}
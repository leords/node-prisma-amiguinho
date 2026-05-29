import { BuscarProdutosAPIServico } from "../servico/produtos/buscarProdutosAPIServico.js";
import { BuscarClienteDeliveryServico } from "../servico/clienteDelivery/buscarClienteDeliveryServico.js";
import { BuscarClienteExternoServico } from "../servico/clienteExterno/buscarClienteExternoServico.js";

export async function sincronizarProdutos() {

    const resposta = await fetch(process.env.PRODUTOS)
    const dados = await resposta.json()
    const produtos = dados.saida
    const servico = new BuscarProdutosAPIServico();
    await servico.executar(produtos)
    console.log(`[SYNC] ${produtos.length} produtos sincronizados`)
}

export async function sincronizarClientesDelivery() {

    const resposta = await fetch(process.env.CLIENTES_DELIVERY,         
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delivery',
          }),
        })

    const dados = await resposta.json()
    const clientes = dados.saida
    const servico = new BuscarClienteDeliveryServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes delivery sincronizados`)
}

export async function sincronizarClientesExternos() {

    const resposta = await fetch(process.env.CLIENTES_EXTERNO,         
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'externa',
          }),
        })

    const dados = await resposta.json()
    const clientes = dados.saida
    const servico = new BuscarClienteExternoServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes externos sincronizados`)
}
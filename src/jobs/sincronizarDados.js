import { BuscarProdutosAPIServico } from "../servico/produtos/buscarProdutosAPIServico.js";
import { BuscarClienteDeliveryServico } from "../servico/clienteDelivery/buscarClienteDeliveryServico.js";
import { BuscarClienteExternoServico } from "../servico/clienteExterno/buscarClienteExternoServico.js";

export async function sincronizarProdutos() {

    const resposta = await fetch(process.env.PRODUTOS)
    const dados = resposta.json()
    const protudos = dados.data
    const servico = new BuscarProdutosAPIServico();
    await servico.executar(protudos)
    console.log(`[SYNC] ${protudos.length} produtos sincronizados`)
}

export async function sincronizarClientesDelivery() {

    const resposta = await fetch(process.env.CLIENTES_DELIVERY)
    const dados = resposta.json()
    const clientes = dados.data
    const servico = new BuscarClienteDeliveryServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes delivery sincronizados`)
}

export async function sincronizarClientesExternos() {

    const resposta = await fetch(process.env.CLIENTES_EXTERNO)
    const dados = resposta.json()
    const clientes = dados.data
    const servico = new BuscarClienteExternoServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes externos sincronizados`)
}
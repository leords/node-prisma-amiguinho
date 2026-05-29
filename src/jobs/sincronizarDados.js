import axios from "axios"

import { BuscarProdutosAPIServico } from "../servico/produtos/buscarProdutosAPIServico";
import { BuscarClienteDeliveryServico } from "../servico/clienteDelivery/buscarClienteDeliveryServico";
import { BuscarClienteExternoServico } from "../servico/clienteExterno/buscarClienteExternoServico";

export async function sincronizarProdutos() {

    const resposta = await axios.get(process.env.PRODUTOS)
    const protudos = resposta.data
    const servico = new BuscarProdutosAPIServico();
    await servico.executar(protudos)
    console.log(`[SYNC] ${protudos.length} produtos sincronizados`)
}

export async function sincronizarClientesDelivery() {

    const resposta = await axios.get(process.env.CLIENTES_DELIVERY)
    const clientes = resposta.data
    const servico = new BuscarClienteDeliveryServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes delivery sincronizados`)
}

export async function sincronizarClientesExternos() {

    const resposta = await axios.get(process.env.CLIENTES_EXTERNO)
    const clientes = resposta.data
    const servico = new BuscarClienteExternoServico();
    await servico.executar(clientes)
    console.log(`[SYNC] ${clientes.length} clientes externos sincronizados`)
}
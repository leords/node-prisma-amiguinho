import { BuscarProdutosAPIServico } from "../servico/produtos/buscarProdutosAPIServico.js";
import { BuscarClienteDeliveryServico } from "../servico/clienteDelivery/buscarClienteDeliveryServico.js";
import { BuscarClienteExternoServico } from "../servico/clienteExterno/buscarClienteExternoServico.js";
import { BuscarFormaPagamentoServico } from "../servico/formaPagamento/buscarFormaPagamentoServico.js";

// Sincroniza os produtos - busca realizada na planilha sheets e salva no banco
export async function sincronizarProdutos() {

    const resposta = await fetch(process.env.PRODUTOS)
    const dados = await resposta.json()
    const produtos = dados.saida
    const servico = new BuscarProdutosAPIServico();
    await servico.executar(produtos)
    console.log(`[SYNC] ${produtos.length} produtos sincronizados`)
}

// Sincroniza os clientes delivery - busca realizada na planilha sheets e salva no banco
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

// Sincroniza os clientes externos - busca realizada na planilha sheets e salva no banco
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

// Sincroniza as formas de pagamento - busca realizada na planilha sheets e salva no banco
export async function sincronizarFormasPagamento() {

    const resposta = await fetch(process.env.FORMAS_PAGAMENTO)
    const dados = await resposta.json()
    const formas = dados.saida
    const servico = new BuscarFormaPagamentoServico()
    await servico.executar(formas) 


    console.log(`[SYNC] ${formas.length} formas de pagamento sincronizados`)

}
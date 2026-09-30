// Referências aos elementos do HTML
const formProduto = document.querySelector("#form-produto");
const listaProdutos = document.querySelector("#lista-produtos");
const nomeInput = document.querySelector("#nome");
const precoInput = document.querySelector("#preco");
const quantidadeInput = document.querySelector("#quantidade");
const botaoFormulario = document.querySelector("#botao-formulario");
const contadorProdutos = document.querySelector("#contador-produtos");
const listaVazia = document.querySelector("#lista-vazia");
const mensagemErro = document.querySelector("#mensagem-erro");

// Guarda o item que está sendo editado.
// Quando for null, o formulário está no modo "adicionar".
let itemEmEdicao = null;

// Atualiza o contador e a mensagem de lista vazia
function atualizarLista() {
  const quantidadeProdutos = listaProdutos.querySelectorAll("li").length;

  contadorProdutos.textContent =
    `Produtos cadastrados: ${quantidadeProdutos}`;

  if (quantidadeProdutos === 0) {
    listaVazia.style.display = "block";
  } else {
    listaVazia.style.display = "none";
  }
}

// Limpa os campos e volta o formulário para o modo de cadastro
function limparFormulario() {
  formProduto.reset();
  itemEmEdicao = null;
  botaoFormulario.textContent = "Adicionar produto";
  mensagemErro.textContent = "";
}

// Adiciona os eventos de Editar e Remover aos itens que já existem
function configurarBotoes(item) {
  const botaoEditar = item.querySelector(".botao-editar");
  const botaoRemover = item.querySelector(".botao-remover");

  botaoRemover.addEventListener("click", function () {
    // Se o item removido estava sendo editado, cancela a edição
    if (itemEmEdicao === item) {
      limparFormulario();
    }

    item.remove();
    atualizarLista();
  });

  botaoEditar.addEventListener("click", function () {
    // Pega os dados guardados nos atributos data-* do item
    nomeInput.value = item.dataset.nome;
    precoInput.value = item.dataset.preco;
    quantidadeInput.value = item.dataset.quantidade;

    itemEmEdicao = item;
    botaoFormulario.textContent = "Salvar alterações";
    mensagemErro.textContent = "";

    // Leva o usuário de volta para o formulário
    nomeInput.focus();
  });
}

// Cria um novo produto visualmente
function criarItem(nome, preco, quantidade) {
  const item = document.createElement("li");

  // Guardamos os valores para conseguir editar depois
  item.dataset.nome = nome;
  item.dataset.preco = preco;
  item.dataset.quantidade = quantidade;

  const informacao = document.createElement("span");
  informacao.classList.add("produto-info");

  informacao.textContent =
    `${nome} - R$ ${Number(preco).toFixed(2).replace(".", ",")} (${quantidade} un.)`;

  const acoes = document.createElement("div");
  acoes.classList.add("acoes");

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.classList.add("botao-editar");
  botaoEditar.textContent = "Editar";

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.classList.add("botao-remover");
  botaoRemover.textContent = "Remover";

  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoRemover);

  item.appendChild(informacao);
  item.appendChild(acoes);

  configurarBotoes(item);

  return item;
}

// Os produtos começam vazios e são criados pelo formulário.

// Evento de envio do formulário
formProduto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = nomeInput.value.trim();
  const preco = Number(precoInput.value);
  const quantidade = Number(quantidadeInput.value);

  // Bônus 3: impede quantidade igual ou menor que zero
  if (quantidade <= 0) {
    mensagemErro.textContent = "A quantidade deve ser maior que zero.";
    quantidadeInput.focus();
    return;
  }

  mensagemErro.textContent = "";

  // Se existe itemEmEdicao, atualizamos o item existente
  if (itemEmEdicao !== null) {
    itemEmEdicao.dataset.nome = nome;
    itemEmEdicao.dataset.preco = preco.toFixed(2);
    itemEmEdicao.dataset.quantidade = quantidade;

    const informacao = itemEmEdicao.querySelector(".produto-info");

    informacao.textContent =
      `${nome} - R$ ${preco.toFixed(2).replace(".", ",")} (${quantidade} un.)`;

    limparFormulario();
    atualizarLista();
    return;
  }

  // Caso contrário, cria um novo item
  const novoItem = criarItem(nome, preco.toFixed(2), quantidade);

  listaProdutos.appendChild(novoItem);

  limparFormulario();
  atualizarLista();
});

// Bônus 1 e 2: inicializa contador e mensagem de lista vazia
atualizarLista();

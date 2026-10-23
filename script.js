const form = document.getElementById("form-prato");
const lista = document.getElementById("lista");
const resumo = document.getElementById("resumo");
const filtro = document.getElementById("filtro");

let pratos = carregar();

function carregar() {
  try {
    return JSON.parse(localStorage.getItem("pratos")) || [];
  } catch (e) {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem("pratos", JSON.stringify(pratos));
  } catch (e) {
    console.error("Não foi possível salvar:", e);
  }
}

function estrelas(nota) {
  return "★".repeat(nota) + "☆".repeat(5 - nota);
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function renderizar() {
  const categoria = filtro.value;
  const visiveis = pratos.filter(p => categoria === "todas" || p.categoria === categoria);

  lista.innerHTML = "";

  if (visiveis.length === 0) {
    resumo.textContent = "Nenhum prato avaliado ainda.";
    return;
  }

  const media = visiveis.reduce((soma, p) => soma + p.nota, 0) / visiveis.length;
  resumo.textContent = `${visiveis.length} prato(s) • média geral: ${media.toFixed(1)}`;

  visiveis.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="linha">
        <strong>${escapar(p.nome)}</strong>
        <span class="estrelas">${estrelas(p.nota)}</span>
      </div>
      <div><span class="tag">${escapar(p.categoria)}</span></div>
      <p>${escapar(p.comentario || "Sem comentário.")}</p>
      <div><button class="remover" data-id="${p.id}">Remover</button></div>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  pratos.push({
    id: Date.now(),
    nome: document.getElementById("nome").value.trim(),
    categoria: document.getElementById("categoria").value,
    nota: Number(document.getElementById("nota").value),
    comentario: document.getElementById("comentario").value.trim()
  });

  salvar();
  form.reset();
  renderizar();
});

lista.addEventListener("click", (e) => {
  if (e.target.classList.contains("remover")) {
    const id = Number(e.target.dataset.id);
    pratos = pratos.filter(p => p.id !== id);
    salvar();
    renderizar();
  }
});

filtro.addEventListener("change", renderizar);

renderizar();

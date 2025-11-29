document.addEventListener("DOMContentLoaded", () => {
    // 1. Proteção de Autenticação
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "index.html";
    }

    // 2. Carrega a lista inicial
    carregarEstoque();

    // 3. Configura a busca no servidor
    configurarBuscaBackend();
});

// --- CARREGAMENTO INICIAL ---
async function carregarEstoque() {
    const tbody = document.getElementById("tabela-estoque-body");
    // Mensagem de carregamento enquanto busca
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Carregando estoque...</td></tr>`;
    
    try {
        const response = await fetch(`${API_URL}/sementes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const lista = await response.json();
            renderizarTabela(lista);
        } else {
            console.error("Erro ao buscar estoque:", response.status);
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Erro ao carregar dados.</td></tr>`;
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Erro de conexão com o servidor.</td></tr>`;
    }
}

// --- BUSCA INTEGRADA AO BACK-END ---
function configurarBuscaBackend() {
    const inputBusca = document.getElementById("input-busca"); // Garanta que seu HTML tem id="input-busca"
    let timeoutId; // Variável para controlar o tempo (debounce)

    if (!inputBusca) return;

    inputBusca.addEventListener("input", (e) => {
        const termo = e.target.value.trim();

        // Limpa o timer anterior para não chamar o banco a cada letra digitada
        clearTimeout(timeoutId);

        // Espera 500ms (meio segundo) após o usuário parar de digitar
        timeoutId = setTimeout(() => {
            if (termo === "") {
                carregarEstoque(); // Se limpou o campo, busca tudo
            } else {
                buscarSementesNoServidor(termo); // Se digitou, filtra no banco
            }
        }, 500);
    });
}

async function buscarSementesNoServidor(termo) {
    const tbody = document.getElementById("tabela-estoque-body");
    
    try {
        // Chama o endpoint de busca que criamos no Java: /api/sementes/buscar?nome=...
        const response = await fetch(`${API_URL}/sementes/buscar?nome=${encodeURIComponent(termo)}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const lista = await response.json();
            renderizarTabela(lista);
        } else {
            console.error("Erro na busca:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão na busca:", error);
    }
}

// --- DESENHAR A TABELA ---
function renderizarTabela(lista) {
    const tbody = document.getElementById("tabela-estoque-body");
    tbody.innerHTML = ""; // Limpa a tabela antes de desenhar

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum item encontrado.</td></tr>`;
        return;
    }

    lista.forEach(semente => {
        const tr = document.createElement("tr");

        // Lógica de Cores (Status)
        let classeStatus = 'status-disponivel';
        let textoStatus = 'Disponível';

        // Usa os dados do banco para decidir a cor
        if (semente.quantidadeKg <= 0) {
            classeStatus = 'status-sem-estoque';
            textoStatus = 'Sem Estoque';
        } else if (semente.nivelMinimoKg && semente.quantidadeKg <= semente.nivelMinimoKg) {
            classeStatus = 'status-baixo';
            textoStatus = 'Estoque Baixo';
        } else if (semente.quantidadeKg < 100) { // Regra de fallback caso nivelMinimo seja null
            classeStatus = 'status-baixo';
            textoStatus = 'Estoque Baixo';
        }

        const statusHtml = `<span class="status ${classeStatus}">${textoStatus}</span>`;

        // Formata Data
        let dataFormatada = "--/--/----";
        if (semente.dataUltimaEntrada) {
            const dataObj = new Date(semente.dataUltimaEntrada);
            dataFormatada = dataObj.toLocaleDateString('pt-BR');
        }

        tr.innerHTML = `
            <td>${semente.tipoSemente}</td>
            <td>${semente.quantidadeKg} kg</td>
            <td>${statusHtml}</td>
            <td>${dataFormatada}</td>
        `;

        tbody.appendChild(tr);
    });
}
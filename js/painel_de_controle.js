document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
    
    // Configurações da interface
    configurarSaudacao();
    configurarSidebar();
    configurarBotoes();
    
    // Busca dados do Backend
    carregarDashboard();
});

// --- AUTENTICAÇÃO ---
function verificarAutenticacao() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }
}

// --- DADOS DO DASHBOARD (BACKEND) ---
async function carregarDashboard() {
    try {
        // Chama o endpoint que criamos no Java
        const response = await fetch(`${API_URL}/dashboard/resumo`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const dados = await response.json();
            
            // 1. Atualiza os Cards (Números)
            atualizarCard("stat-em-transito", dados.emTransito);
            atualizarCard("stat-entregues", dados.entreguesHoje);
            atualizarCard("stat-confirmados", dados.taxaConfirmacao);

            // 2. Atualiza a Lista de Atividades
            atualizarListaAtividades(dados.atividades);
        } else {
            console.error("Erro ao carregar dashboard:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão ao carregar dashboard:", error);
    }
}

function atualizarCard(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerText = valor;
        // Pequena animação de opacidade
        elemento.style.transition = "opacity 0.5s";
        elemento.style.opacity = 0;
        setTimeout(() => elemento.style.opacity = 1, 100);
    }
}

function atualizarListaAtividades(atividades) {
    const lista = document.getElementById("lista-atividades");
    if (!lista) return;

    lista.innerHTML = ""; // Limpa o "Carregando..."

    if (!atividades || atividades.length === 0) {
        lista.innerHTML = "<p style='color: #888; padding: 10px;'>Nenhuma atividade recente.</p>";
        return;
    }

    atividades.forEach(atividade => {
        const item = document.createElement("div");
        item.className = "activity-item";
        
        // Monta o HTML do item de atividade
        item.innerHTML = `
            <div class="activity-content">
                <span class="activity-text">${atividade.descricao}</span>
                <span class="activity-date" style="font-size: 0.85em; color: #666; display: block; margin-top: 4px;">
                    <i class="far fa-clock"></i> ${atividade.dataHora}
                </span>
            </div>
        `;
        
        lista.appendChild(item);
    });
}

// --- INTERFACE E SAUDAÇÃO ---
function configurarSaudacao() {
    const elementoSaudacao = document.getElementById("usuario-saudacao") || document.querySelector('.header-title p');
    
    if (elementoSaudacao) {
        // 1. Define Bom dia/Boa tarde/Boa noite
        const hora = new Date().getHours();
        let saudacaoTempo = "Bem vindo";
        if (hora < 12) saudacaoTempo = "Bom dia";
        else if (hora < 18) saudacaoTempo = "Boa tarde";
        else saudacaoTempo = "Boa noite";

        // 2. Pega o nome do usuário salvo no login
        const usuarioEmail = localStorage.getItem("usuario") || "Doutor";
        // Pega apenas o primeiro nome (antes do espaço ou do @)
        let nomeExibicao = usuarioEmail.includes("@") ? usuarioEmail.split("@")[0] : usuarioEmail;
        nomeExibicao = nomeExibicao.charAt(0).toUpperCase() + nomeExibicao.slice(1);

        // 3. Atualiza o texto
        elementoSaudacao.textContent = `${saudacaoTempo}, ${nomeExibicao}`;
    }
}

function configurarSidebar() {
    const paginaAtual = window.location.pathname.split("/").pop();
    const linksSidebar = document.querySelectorAll('.sidebar-nav a');

    linksSidebar.forEach(link => {
        const href = link.getAttribute('href');
        const item = link.closest('.nav-item');
        
        // Remove active de todos e adiciona no atual
        if (item) item.classList.remove('active');
        
        if (href === paginaAtual && item) {
            item.classList.add('active');
        }
    });
}

// --- BOTÕES E AÇÕES ---
function configurarBotoes() {
    const btnNovoEnvio = document.querySelector('.btn-novo-envio') || document.getElementById('btn-novo-envio');
    const btnBuscarLote = document.querySelector('.btn-buscar-lote') || document.getElementById('btn-buscar-lote');

    if (btnNovoEnvio) {
        btnNovoEnvio.addEventListener('click', () => {
            window.location.href = "envios.html"; // Redireciona para a tela de criar envio
        });
    }

    if (btnBuscarLote) {
    btnBuscarLote.addEventListener('click', () => {
        window.location.href = "rastreio.html"; // Redireciona para a tela de rastreio
    });
    }

}


// --- BUSCA DE LOTE (Função Auxiliar) ---
async function buscarEExibirLote(codigoLote) {
    try {
        const response = await fetch(`${API_URL}/envios/buscar/${codigoLote}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.ok) {
            const data = await response.json();
            const envio = data.envio;
            const historico = data.historico;

            let mensagem = `📦 DETALHES DO LOTE: ${envio.codigoLote}\n\n`;
            mensagem += `Agricultor: ${envio.agricultor.nome || envio.agricultor.nomeRazaoSocial}\n`;
            mensagem += `Semente: ${envio.semente.tipoSemente}\n`;
            mensagem += `Quantidade: ${envio.quantidadeEnviadaKg} kg\n`;
            mensagem += `Status: ${envio.status}\n`;
            
            if (historico && historico.length > 0) {
                mensagem += `\n📋 ÚLTIMO STATUS:\n${historico[historico.length - 1].descricao}`;
            }

            alert(mensagem);
        } else {
            alert("❌ Lote não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar lote:", error);
        alert("Erro ao comunicar com o servidor.");
    }
}
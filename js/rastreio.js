document.addEventListener("DOMContentLoaded", () => {
    // 1. Proteção de Autenticação
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "index.html";
    }

    // Configura o botão
    const btnRastrear = document.getElementById("btn-rastrear");
    const inputCodigo = document.getElementById("input-codigo-lote");

    if (btnRastrear) {
        btnRastrear.addEventListener("click", () => {
            const codigo = inputCodigo.value.trim();
            if (codigo) buscarRastreio(codigo);
        });
    }
    
    // Permitir buscar com "Enter"
    if (inputCodigo) {
        inputCodigo.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const codigo = inputCodigo.value.trim();
                if (codigo) buscarRastreio(codigo);
            }
        });
    }
});

async function buscarRastreio(codigoLote) {
    const divResultado = document.getElementById("resultado-rastreio");
    const divErro = document.getElementById("msg-erro");
    const btnRastrear = document.getElementById("btn-rastrear");

    // Limpa estado anterior
    divResultado.style.display = "none";
    divErro.style.display = "none";
    btnRastrear.textContent = "Buscando...";
    btnRastrear.disabled = true;

    try {
        // Usa a função do api.js se existir, senão faz fetch manual
        let data;
        if (typeof buscarEnvioPorCodigo === 'function') {
            const res = await buscarEnvioPorCodigo(codigoLote);
            if (!res.success) throw new Error(res.error);
            data = res.data;
        } else {
            // Fallback manual
            const response = await fetch(`${API_URL}/envios/buscar/${codigoLote}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (!response.ok) throw new Error("Lote não encontrado");
            data = await response.json();
        }

        // Sucesso: Preenche os dados
        preencherDados(data);
        divResultado.style.display = "block";

    } catch (error) {
        console.error(error);
        const textoErro = document.getElementById("texto-erro");
        textoErro.textContent = error.message || "Lote não encontrado.";
        divErro.style.display = "flex";
    } finally {
        btnRastrear.textContent = "Buscar";
        btnRastrear.disabled = false;
    }
}

function preencherDados(data) {
    const envio = data.envio;
    const historico = data.historico;

    // Cabeçalho
    document.getElementById("lbl-codigo").textContent = `Lote #${envio.codigoLote}`;
    document.getElementById("lbl-agricultor").textContent = envio.agricultor.nome || envio.agricultor.nomeRazaoSocial;
    document.getElementById("lbl-produto").textContent = envio.semente.tipoSemente;
    document.getElementById("lbl-quantidade").textContent = `${envio.quantidadeEnviadaKg} kg`;

    // Badge de Status
    const badge = document.getElementById("lbl-status-badge");
    badge.className = "status-badge"; // Reseta classes
    badge.textContent = formatarStatus(envio.status);
    
    if (envio.status === 'CRIADO') badge.classList.add('status-criado');
    else if (envio.status === 'ENTREGUE') badge.classList.add('status-entregue');
    else badge.classList.add('status-transito');

    // Timeline
    const lista = document.getElementById("lista-historico");
    lista.innerHTML = ""; // Limpa lista anterior

    // Ordena do mais recente para o mais antigo para a timeline
    // (O backend já deve mandar ordenado, mas garantimos aqui)
    const historicoOrdenado = historico.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    historicoOrdenado.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "timeline-item";
        
        // O primeiro item (índice 0) é o mais recente -> ganha destaque
        if (index === 0) li.classList.add("latest");

        // Formata data e hora
        const dataObj = new Date(item.dataHora);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3>${formatarStatus(item.status)}</h3>
                <p>${item.descricao || "Status atualizado."}</p>
                <span class="time">${dataFormatada} às ${horaFormatada}</span>
            </div>
        `;
        lista.appendChild(li);
    });
}

function formatarStatus(status) {
    const mapa = {
        'CRIADO': 'Criado',
        'EM_TRANSITO': 'Em Trânsito',
        'ENTREGUE': 'Entregue',
        'CONFIRMADO': 'Confirmado'
    };
    return mapa[status] || status;
}
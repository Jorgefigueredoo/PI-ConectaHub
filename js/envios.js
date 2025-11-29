// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    
    // --- PROTEÇÃO CONTRA ERRO DE CARREGAMENTO ---
    // Verifica se a função do api.js existe antes de chamar
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        // Fallback manual se o api.js falhar
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Token não encontrado ou api.js não carregou.");
            window.location.href = "login.html";
        }
    }

    // Inicia as funções da tela
    carregarSementes();
    configurarBuscaAgricultor();
});

// 1. Carrega as sementes para o Dropdown (Select)
async function carregarSementes() {
    try {
        // Garante que API_URL existe, senão usa o padrão
        const baseUrl = (typeof API_URL !== 'undefined') ? API_URL : 'http://localhost:8080/api';
        
        const response = await fetch(`${baseUrl}/sementes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const sementes = await response.json();
            const select = document.getElementById("select-semente");
            
            // Limpa e mantém a opção padrão
            select.innerHTML = '<option value="" disabled selected>Selecione uma semente</option>';

            sementes.forEach(semente => {
                const option = document.createElement("option");
                option.value = semente.id;
                option.textContent = `${semente.tipoSemente} (Disp: ${semente.quantidadeKg}kg)`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar sementes:", error);
    }
}

// 2. Configura a barra de busca de Agricultores
function configurarBuscaAgricultor() {
    const inputBusca = document.getElementById("input-busca-agricultor");
    const listaResultados = document.getElementById("lista-resultados-agricultor");
    let timeoutId;

    if(!inputBusca) return; 

    inputBusca.addEventListener("input", (e) => {
        const termo = e.target.value;
        clearTimeout(timeoutId);
        
        if (termo.length < 3) {
            if(listaResultados) listaResultados.style.display = "none";
            return;
        }

        timeoutId = setTimeout(() => buscarAgricultoresLocal(termo), 500);
    });
}

async function buscarAgricultoresLocal(termo) {
    try {
        const baseUrl = (typeof API_URL !== 'undefined') ? API_URL : 'http://localhost:8080/api';
        
        const response = await fetch(`${baseUrl}/agricultores/buscar?nome=${termo}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const agricultores = await response.json();
        const listaResultados = document.getElementById("lista-resultados-agricultor");
        
        if(!listaResultados) return;
        
        listaResultados.innerHTML = ""; 

        if (agricultores.length === 0) {
            listaResultados.style.display = "none";
            return;
        }

        agricultores.forEach(agricultor => {
            const div = document.createElement("div");
            div.className = "search-item";
            div.textContent = `${agricultor.nome || agricultor.nomeRazaoSocial} (${agricultor.cpfCnpj})`;
            
            div.onclick = () => {
                document.getElementById("input-busca-agricultor").value = agricultor.nome || agricultor.nomeRazaoSocial;
                document.getElementById("agricultor-id-selecionado").value = agricultor.id;
                listaResultados.style.display = "none";
            };
            
            listaResultados.appendChild(div);
        });

        listaResultados.style.display = "block";

    } catch (error) {
        console.error("Erro na busca:", error);
    }
}

// 3. Registra o Envio
async function registrarEnvio() {
    const agricultorId = document.getElementById("agricultor-id-selecionado").value;
    const sementeId = document.getElementById("select-semente").value;
    const quantidade = document.getElementById("input-quantidade").value;

    if (!agricultorId) return alert("Por favor, busque e selecione um agricultor da lista.");
    if (!sementeId) return alert("Selecione um tipo de semente.");
    if (!quantidade || quantidade <= 0) return alert("Informe uma quantidade válida.");

    const payload = {
        agricultorId: parseInt(agricultorId),
        sementeId: parseInt(sementeId),
        quantidadeKg: parseFloat(quantidade),
        codigoLote: "LOTE-" + Date.now().toString().slice(-6) 
    };

    try {
        const baseUrl = (typeof API_URL !== 'undefined') ? API_URL : 'http://localhost:8080/api';

        const response = await fetch(`${API_URL}/envios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const envioCriado = await response.json();
            alert(`Envio registrado com sucesso!\nLote: ${envioCriado.codigoLote}`);
            window.location.href = "painel_de_controle.html"; 
        } else {
            alert("Erro ao registrar envio. Verifique o estoque.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
}
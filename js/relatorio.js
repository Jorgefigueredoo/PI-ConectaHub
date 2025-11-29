document.addEventListener("DOMContentLoaded", () => {
    // 1. Proteção de Autenticação
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "index.html";
    }

    // 2. Configura o botão de gerar
    const form = document.getElementById("form-relatorio");
    const btnGerar = document.getElementById("btn-gerar-pdf");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            // Captura os dados
            const cliente = document.getElementById("filtro-cliente").value.trim();
            const dataInicio = document.getElementById("filtro-data-inicio").value;
            const dataFim = document.getElementById("filtro-data-fim").value;
            const municipio = document.getElementById("filtro-municipio").value.trim();
            
            // Monta o objeto de filtro
            const filtro = {
                municipio: municipio || null,
                dataInicio: dataInicio || null,
                dataFim: dataFim || null,
                sementeId: null, 
                agricultorId: null
            };

            // Feedback visual
            const textoOriginal = btnGerar.innerText;
            btnGerar.innerText = "Baixando PDF...";
            btnGerar.disabled = true;
            btnGerar.style.opacity = "0.7";

            try {
                const baseUrl = (typeof API_URL !== 'undefined') ? API_URL : 'http://localhost:8080/api';
                
                const response = await fetch(`${baseUrl}/relatorios/gerar`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(filtro)
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "relatorio_envios.pdf"; 
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);

                    console.log("Download iniciado!");
                } else {
                    if (response.status === 403) {
                        alert("Sessão expirada. Faça login novamente.");
                        window.location.href = "login.html";
                    } else {
                        alert("Erro ao gerar relatório. Código: " + response.status);
                    }
                }
            } catch (error) {
                console.error("Erro técnico:", error);
                alert("Erro de conexão com o servidor.");
            }

            // Restaura o botão
            btnGerar.innerText = textoOriginal;
            btnGerar.disabled = false;
            btnGerar.style.opacity = "1";
        });
    }
});
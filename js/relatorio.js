document.addEventListener("DOMContentLoaded", () => {
    // 1. Proteção de Autenticação
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "login.html";
    }

    // 2. Configura o botão de gerar
    const form = document.getElementById("form-relatorio");
    const btnGerar = document.getElementById("btn-gerar-pdf");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            // ✅ CORREÇÃO: Captura TODOS os campos
            const cliente = document.getElementById("filtro-cliente")?.value.trim();
            const dataInicio = document.getElementById("filtro-data-inicio")?.value;
            const dataFim = document.getElementById("filtro-data-fim")?.value;
            const municipio = document.getElementById("filtro-municipio")?.value.trim();
            const semente = document.getElementById("filtro-semente")?.value.trim();

            console.log("=== DADOS CAPTURADOS DO FORM ===");
            console.log("Cliente:", cliente);
            console.log("Data Início:", dataInicio);
            console.log("Data Fim:", dataFim);
            console.log("Município:", municipio);
            console.log("Semente:", semente);

            // ✅ Monta o objeto de filtro corretamente
            const filtro = {
                // Se preenchido, envia; senão, envia null
                municipio: municipio || null,
                dataInicio: dataInicio || null,
                dataFim: dataFim || null,
                // Deixamos agricultorId e sementeId como null por enquanto
                // (você pode melhorar buscando esses IDs depois)
                agricultorId: null,
                sementeId: null
            };

            console.log("=== FILTRO ENVIADO PARA O BACKEND ===");
            console.log(JSON.stringify(filtro, null, 2));

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

                console.log("=== RESPOSTA DO SERVIDOR ===");
                console.log("Status:", response.status);
                console.log("OK?", response.ok);

                if (response.ok) {
                    const blob = await response.blob();
                    console.log("Tamanho do PDF:", blob.size, "bytes");

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    
                    // Nome do arquivo com timestamp
                    const timestamp = new Date().toISOString().slice(0, 10);
                    a.download = `relatorio_envios_${timestamp}.pdf`;
                    
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);

                    alert("✅ Relatório gerado com sucesso!");
                } else {
                    const errorText = await response.text();
                    console.error("Erro do servidor:", errorText);

                    if (response.status === 403) {
                        alert("❌ Sessão expirada. Faça login novamente.");
                        window.location.href = "login.html";
                    } else {
                        alert(`❌ Erro ao gerar relatório.\nCódigo: ${response.status}\nDetalhes: ${errorText}`);
                    }
                }
            } catch (error) {
                console.error("Erro técnico:", error);
                alert("❌ Erro de conexão com o servidor.");
            }

            // Restaura o botão
            btnGerar.innerText = textoOriginal;
            btnGerar.disabled = false;
            btnGerar.style.opacity = "1";
        });
    }
});
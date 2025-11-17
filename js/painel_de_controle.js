document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    // Aqui pegamos os botões grandes da tela
    // Nota: Você precisará adicionar essas classes ou IDs no seu HTML (veja o Passo 2)
    const btnNovoEnvio = document.querySelector('.btn-novo-envio');
    const btnBuscarLote = document.querySelector('.btn-buscar-lote');
    const linksSidebar = document.querySelectorAll('.sidebar-menu a'); // Ajuste conforme sua classe da sidebar

    // --- 2. AÇÕES DOS BOTÕES ---

    // Botão "Preparar novo envio"
    if (btnNovoEnvio) {
        btnNovoEnvio.addEventListener('click', function() {
            // Redireciona para a página de envios
            window.location.href = "envios.html";
        });
    }

    // Botão "Buscar lote" (Simulação)
    if (btnBuscarLote) {
        btnBuscarLote.addEventListener('click', function() {
            alert("Abrindo busca de lotes...");
            // Futuramente, aqui você abriria um modal ou iria para outra tela
        });
    }

    // --- 3. INTERATIVIDADE DA SIDEBAR (Menu Lateral) ---
    // Faz o link ficar "ativo" quando clicado (visual apenas)
    linksSidebar.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove a classe 'active' de todos
            linksSidebar.forEach(l => l.classList.remove('active'));
            // Adiciona no que foi clicado
            this.classList.add('active');
        });
    });

    // --- 4. SAUDAÇÃO DINÂMICA (Bônus) ---
    // Altera o texto de boas-vindas baseado na hora do dia
    const elementoSaudacao = document.querySelector('h2, .welcome-text'); // Tenta achar onde está o texto "Bem vindo"
    
    if (elementoSaudacao && elementoSaudacao.innerText.includes("Bem vindo")) {
        const hora = new Date().getHours();
        let saudacao = "Bem vindo";

        if (hora < 12) {
            saudacao = "Bom dia";
        } else if (hora < 18) {
            saudacao = "Boa tarde";
        } else {
            saudacao = "Boa noite";
        }
        
        // Mantém o nome do usuário, só troca o começo
        elementoSaudacao.innerText = elementoSaudacao.innerText.replace("Bem vindo", saudacao);
    }

    // --- 5. LOGOUT (Se tiver botão de sair) ---
    // Se você tiver um botão de sair na sidebar
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            if(confirm("Deseja realmente sair?")) {
                window.location.href = "login.html";
            }
        });
    }
});
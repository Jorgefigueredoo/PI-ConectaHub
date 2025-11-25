document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DA BARRA LATERAL (SIDEBAR) ---
    
    // 1. Pega o nome do arquivo atual (ex: "envios.html")
    const pagAtual = window.location.pathname.split("/").pop();

    // 2. Seleciona todos os links do menu
    const menuItems = document.querySelectorAll('.menu-item');

    // 3. Verifica cada link
    menuItems.forEach(item => {
        // Pega o destino do link (o href)
        const linkDestino = item.getAttribute('href');

        // Se o link for igual à página atual, adiciona a classe "active"
        if (linkDestino === pagAtual) {
            item.classList.add('active');
        } else {
            // Garante que os outros não tenham a classe (segurança)
            item.classList.remove('active');
        }
    });

    // --- LÓGICA ESPECIAL PARA O BOTÃO "BUSCAR" ---
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function(e) {
            e.preventDefault(); // Não muda de página
            // Foca no input de busca se ele existir na página
            const inputBusca = document.querySelector('input[type="search"]') || document.getElementById('agricultor-busca');
            if (inputBusca) {
                inputBusca.focus();
                inputBusca.style.boxShadow = "0 0 10px rgba(0,0,255, 0.5)"; // Efeito visual
            } else {
                alert("Funcionalidade de busca global em desenvolvimento!");
            }
        });
    }
});
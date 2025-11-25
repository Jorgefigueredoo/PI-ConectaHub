document.addEventListener('DOMContentLoaded', function() {
    
    // --- FUNCIONALIDADE 1: Gerar Relatório ---
    const btnGerar = document.querySelector('.btn-outline');
    const inputs = document.querySelectorAll('.report-form input');

    // Quando clicar no botão "Gerar Relatório"
    if(btnGerar) {
        btnGerar.addEventListener('click', function(event) {
            event.preventDefault(); // Impede a página de recarregar sozinha

            // 1. Verifica se todos os campos estão preenchidos
            let estaTudoPreenchido = true;
            inputs.forEach(function(input) {
                if (input.value.trim() === "") {
                    estaTudoPreenchido = false;
                }
            });

            // 2. Se faltar algo, avisa. Se estiver tudo ok, "gera" o PDF.
            if (!estaTudoPreenchido) {
                alert("Por favor, preencha todos os campos antes de gerar o relatório.");
            } else {
                // Muda o texto do botão para parecer que está carregando
                const textoOriginal = btnGerar.textContent;
                btnGerar.textContent = "Processando...";
                btnGerar.style.opacity = "0.7";

                // Espera 1.5 segundos e mostra sucesso
                setTimeout(function() {
                    alert("Sucesso! O relatório PDF foi gerado e baixado para seu computador.");
                    
                    // Volta o botão ao normal e limpa os campos
                    btnGerar.textContent = textoOriginal;
                    btnGerar.style.opacity = "1";
                    inputs.forEach(input => input.value = ""); 
                }, 1500);
            }
        });
    }

    // --- FUNCIONALIDADE 2: Atualizar Painel de Avisos ---
    const btnAtualizar = document.querySelector('.btn-primary');
    const areaTexto = document.querySelector('textarea');

    if(btnAtualizar) {
        btnAtualizar.addEventListener('click', function() {
            const textoAviso = areaTexto.value;

            if (textoAviso.trim() === "") {
                alert("Escreva uma mensagem antes de publicar.");
            } else {
                alert("Aviso publicado no Portal da Transparência com sucesso!");
                areaTexto.value = ""; // Limpa a caixa de texto
            }
        });
    }
});
// Aguarda o site carregar todo
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o botão pela classe que está no HTML
    const botaoEntrar = document.querySelector('.btn-entrar');

    if (botaoEntrar) {
        botaoEntrar.addEventListener('click', function() {
            console.log("Botão clicado! Tentando redirecionar...");
            
            // Redireciona para o painel
            window.location.href = "painel_de_controle.html";
        });
    } else {
        console.error("Erro: O botão 'Entrar' não foi encontrado no HTML.");
    }

});
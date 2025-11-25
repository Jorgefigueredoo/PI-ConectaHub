document.addEventListener('DOMContentLoaded', function() {

    // --- 1. SELETORES ---
    // Pegamos os elementos pelos IDs (vamos configurar no HTML jaja)
    const btnRegistrar = document.querySelector('.btn-registrar');
    const inputAgricultor = document.getElementById('agricultor-busca');
    const selectSemente = document.getElementById('tipo-semente');
    const selectQuantidade = document.getElementById('quantidade');

    // --- 2. AÇÃO DO BOTÃO REGISTRAR ---
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', function(event) {
            event.preventDefault(); // Evita recarregar a página

            // Validação Básica
            // Verifica se os campos foram "selecionados" (simulação)
            
            // Pega os valores (caso existam)
            const agricultor = inputAgricultor ? inputAgricultor.value : "Agricultor Teste";
            const semente = selectSemente ? selectSemente.value : "";
            const qtd = selectQuantidade ? selectQuantidade.value : "";

            // Se o usuário não selecionou semente ou quantidade (assumindo valor vazio como padrão)
            if (semente === "" || qtd === "") {
                alert("⚠️ Por favor, selecione o Tipo de Semente e a Quantidade.");
                return;
            }

            // Feedback Visual (Simulando processamento)
            btnRegistrar.innerText = "Gerando etiqueta...";
            btnRegistrar.style.backgroundColor = "#2ecc71"; // Verde temporário

            setTimeout(function() {
                // Mensagem de Sucesso
                alert(`✅ SUCESSO!\n\nEnvio registrado para: José da Silva\nSemente: ${semente}\nQuantidade: ${qtd}kg\n\nA etiqueta foi enviada para impressão.`);
                
                // Reseta o botão
                btnRegistrar.innerText = "Gerar etiqueta e Registrar Envio";
                btnRegistrar.style.backgroundColor = ""; // Volta a cor original
                
                // Opcional: Redirecionar de volta para o painel após o sucesso
                // window.location.href = "painel_de_controle.html";

            }, 1500); // Espera 1,5 segundos para parecer real
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // 1. Pegamos o campo de busca (o input)
    const campoBusca = document.querySelector('.search-bar-dark input');
    
    // 2. Pegamos todas as linhas da tabela (apenas do corpo, ignorando o cabeçalho)
    const linhasTabela = document.querySelectorAll('.stock-table tbody tr');

    // 3. Adicionamos um "ouvinte" para cada vez que alguém digitar algo
    campoBusca.addEventListener('input', function() {
        const textoDigitado = campoBusca.value.toLowerCase(); // Transforma tudo em minúsculo

        // Para cada linha da tabela, vamos verificar se ela deve aparecer
        linhasTabela.forEach(function(linha) {
            // Pega o texto da primeira coluna (Nome da Semente)
            const nomeSemente = linha.cells[0].textContent.toLowerCase();

            // Se o nome da semente contém o que foi digitado...
            if (nomeSemente.includes(textoDigitado)) {
                linha.style.display = ''; // Mostra a linha
            } else {
                linha.style.display = 'none'; // Esconde a linha
            }
        });
    });
});
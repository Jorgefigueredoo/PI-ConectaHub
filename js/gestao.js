document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pegamos o botão de adicionar e a lista onde ficam os fornecedores
    const botaoAdicionar = document.querySelector('.btn-add-new');
    const listaFornecedores = document.querySelector('.supplier-list');

    // 2. Quando clicar no botão "Cadastrar"...
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', function() {
            
            // Pergunta o nome para o usuário
            const nomeFornecedor = prompt("Digite a Razão Social do novo fornecedor:");

            // Se o usuário digitou algo e deu OK
            if (nomeFornecedor && nomeFornecedor.trim() !== "") {
                
                // Cria uma nova div (caixinha) para o fornecedor
                const novoItem = document.createElement('div');
                novoItem.classList.add('supplier-item');

                // Preenche o conteúdo HTML dessa nova caixinha (igual ao seu HTML original)
                novoItem.innerHTML = `
                    <div class="supplier-name">${nomeFornecedor}</div>
                    <div class="supplier-dropdown">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                `;

                // Adiciona essa nova caixinha no final da lista
                listaFornecedores.appendChild(novoItem);

                // Avisa que deu certo
                alert("Fornecedor " + nomeFornecedor + " cadastrado com sucesso!");
            }
        });
    }

    // 3. Funcionalidade para as setinhas (Simulação)
    // Usamos isso para funcionar tanto nos itens velhos quanto nos novos
    listaFornecedores.addEventListener('click', function(event) {
        
        // Verifica se clicou na setinha ou no botão cinza
        if (event.target.closest('.supplier-dropdown')) {
            alert("Aqui abririam as opções de Editar ou Excluir este fornecedor.");
        }
    });

});
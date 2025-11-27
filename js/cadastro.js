document.addEventListener('DOMContentLoaded', function() {
    
    const formCadastro = document.getElementById('form-cadastro');
    const botaoCadastrar = document.querySelector('.btn-cadastrar');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;

            if (senha.length < 3) {
                alert('A senha é muito curta!');
                return;
            }

            // Feedback visual
            const textoOriginal = botaoCadastrar.textContent;
            botaoCadastrar.textContent = 'Criando conta...';
            botaoCadastrar.disabled = true;

            // Chama a API
            const resultado = await fazerCadastro(nome, email, senha);

            if (resultado.success) {
                alert('✅ Conta criada com sucesso!');
                window.location.href = 'login.html';
            } else {
                alert('❌ ' + resultado.error);
                botaoCadastrar.textContent = textoOriginal;
                botaoCadastrar.disabled = false;
            }
        });
    }
});
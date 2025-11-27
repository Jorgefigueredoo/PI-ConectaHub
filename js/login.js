document.addEventListener('DOMContentLoaded', function() {
    
    // --- SELEÇÃO DOS ELEMENTOS ---
    const botaoEntrar = document.querySelector('.btn-entrar');
    const botaoCadastrar = document.querySelector('.btn-cadastrar');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');

    // --- VERIFICAR SE JÁ ESTÁ LOGADO ---
    if (estaLogado()) {
        window.location.href = 'painel_de_controle.html';
        return;
    }

    // --- FUNÇÃO DE LOGIN ---
    if (botaoEntrar) {
        botaoEntrar.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const email = campoEmail.value.trim();
            const senha = campoSenha.value;

            if (!email || !senha) {
                alert('⚠️ Por favor, preencha email e senha.');
                return;
            }

            // Feedback visual
            botaoEntrar.textContent = 'Entrando...';
            botaoEntrar.disabled = true;
            botaoEntrar.style.opacity = '0.7';

            try {
                const resultado = await fazerLogin(email, senha);

                if (resultado.success) {
                    botaoEntrar.textContent = '✓ Sucesso!';
                    botaoEntrar.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        window.location.href = 'painel_de_controle.html';
                    }, 500);
                } else {
                    alert('⚠️ ' + (resultado.error || 'Email ou senha incorretos'));
                    resetarBotao();
                }
            } catch (error) {
                console.error(error);
                alert('⚠️ Erro ao conectar com o servidor.');
                resetarBotao();
            }
        });

        // Login com Enter
        campoSenha.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') botaoEntrar.click();
        });
    }

    // --- BOTÃO DE CADASTRAR (Ajustado) ---
    if (botaoCadastrar) {
        botaoCadastrar.addEventListener('click', function(e) {
            e.preventDefault();
            // 👇 AQUI ESTÁ A MUDANÇA: Redireciona para a tela de cadastro
            window.location.href = 'cadastro.html'; 
        });
    }

    function resetarBotao() {
        botaoEntrar.textContent = 'Entrar';
        botaoEntrar.disabled = false;
        botaoEntrar.style.opacity = '1';
        botaoEntrar.style.backgroundColor = '#1a3a68';
    }
});
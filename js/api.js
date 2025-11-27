// ========================================
// CONFIGURAÇÃO BASE DA API
// ========================================
const API_BASE_URL = 'http://localhost:8080/api';

// --- GERENCIAMENTO DO TOKEN (JWT) ---

function getToken() {
    return localStorage.getItem('token');
}

function salvarToken(token) {
    localStorage.setItem('token', token);
}

function removerToken() {
    localStorage.removeItem('token');
}

function estaLogado() {
    return getToken() !== null;
}

// ========================================
// 1. FUNÇÕES DE AUTENTICAÇÃO (LOGIN E CADASTRO)
// ========================================

/**
 * Faz o Login no sistema
 * ⚠️ ATENÇÃO: No Java, seu DTO pede 'email' e 'senha'
 */
async function fazerLogin(email, senha) {
    console.log("Tentando logar com:", email);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envia exatamente os nomes que o LoginRequestDTO espera
            body: JSON.stringify({ 
                email: email, 
                senha: senha 
            })
        });

        if (response.ok) {
            const data = await response.json();
            salvarToken(data.token);
            return { success: true, token: data.token };
        } else {
            return { success: false, error: 'Email ou senha incorretos' };
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, error: 'Erro de conexão com o servidor' };
    }
}

/**
 * Faz o Cadastro de novo usuário
 * ⚠️ ATENÇÃO: No Java, o RegisterDTO costuma esperar 'login' e 'password'
 */
async function fazerCadastro(nome, email, senha) {
    console.log("Tentando cadastrar:", email);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Mapeamos os dados do formulário para o padrão do Spring Security
            body: JSON.stringify({ 
                name: nome,       // Se seu DTO tiver campo nome
                login: email,     // O Spring Security usa 'login' como usuário
                password: senha,  // O Spring Security usa 'password' como senha
                role: 'USER'      // Define permissão padrão
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            // Tenta ler a mensagem de erro que o Java mandou (ex: "Email em uso")
            const textoErro = await response.text();
            return { success: false, error: textoErro || 'Erro ao realizar cadastro.' };
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        return { success: false, error: 'Erro de conexão com o servidor' };
    }
}

// ========================================
// 2. FUNÇÕES PROTEGIDAS (PRECISAM DE TOKEN)
// ========================================

/**
 * Busca agricultores (Exemplo de rota protegida)
 */
async function buscarAgricultores(nome) {
    try {
        const response = await fetch(`${API_BASE_URL}/agricultores/buscar?nome=${encodeURIComponent(nome)}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}` // Envia o token no cabeçalho
            }
        });

        if (response.ok) {
            return await response.json();
        } else if (response.status === 403) {
            console.warn("Token expirado ou inválido.");
            // Opcional: removerToken(); window.location.href = 'login.html';
            return [];
        } else {
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar agricultores:', error);
        return [];
    }
}

/**
 * Lista Estoque (Exemplo)
 */
async function listarEstoque() {
    try {
        const response = await fetch(`${API_BASE_URL}/sementes`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.ok) return await response.json();
        return [];
    } catch (error) {
        return [];
    }
}

// ========================================
// 3. UTILITÁRIOS DE NAVEGAÇÃO
// ========================================

function verificarAutenticacao() {
    if (!estaLogado()) {
        window.location.href = 'login.html';
    }
}

function fazerLogout() {
    removerToken();
    window.location.href = 'login.html';
}
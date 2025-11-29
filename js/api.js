// ========================================
// CONFIGURAÇÃO BASE DA API
// ========================================
const API_URL = 'http://localhost:8080/api'; 

// --- GERENCIAMENTO DO TOKEN (JWT) ---

function getToken() {
    return localStorage.getItem('token');
}

function salvarToken(token) {
    localStorage.setItem('token', token);
}

function removerToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
}

function estaLogado() {
    return getToken() !== null;
}

// ========================================
// 1. FUNÇÕES DE AUTENTICAÇÃO
// ========================================

async function fazerLogin(email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (response.ok) {
            const data = await response.json();
            salvarToken(data.token);
            localStorage.setItem('usuario', email);
            return { success: true, token: data.token };
        } else {
            return { success: false, error: 'Dados incorretos' };
        }
    } catch (error) {
        return { success: false, error: 'Erro de conexão' };
    }
}

// ✅ FUNÇÃO DE CADASTRO CORRIGIDA
async function fazerCadastro(nome, email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                name: nome,
                login: email,
                password: senha,
                role: "USER"
            })
        });

        // ✅ Apenas verifica o status - NÃO tenta ler o body
        if (response.ok) {
            return { success: true };
        }

        // ❌ Se deu erro, retorna mensagem genérica
        return { 
            success: false, 
            error: 'Não foi possível criar a conta. Tente novamente.' 
        };

    } catch (error) {
        console.error('Erro no cadastro:', error);
        return { 
            success: false, 
            error: 'Erro de conexão com o servidor' 
        };
    }
}

// ========================================
// 2. FUNÇÕES DE FORNECEDORES (CRUD COMPLETO)
// ========================================

// Lista todos os fornecedores
async function listarFornecedores() {
    try {
        const response = await fetch(`${API_URL}/fornecedores`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) return await response.json();
        return [];
    } catch (error) {
        console.error("Erro ao listar:", error);
        return [];
    }
}

// Cria um novo fornecedor
async function criarFornecedor(razaoSocial, cnpj) {
    try {
        const response = await fetch(`${API_URL}/fornecedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ razaoSocial, cnpj })
        });

        if (response.ok) return { success: true, data: await response.json() };
        
        const errorText = await response.text(); 
        return { success: false, error: errorText || "Erro ao criar" };
    } catch (error) {
        return { success: false, error: "Erro de conexão" };
    }
}

// Atualiza um fornecedor
async function atualizarFornecedor(id, razaoSocial, cnpj) {
    try {
        const response = await fetch(`${API_URL}/fornecedores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ razaoSocial, cnpj })
        });

        if (response.ok) return { success: true };
        return { success: false, error: "Erro ao atualizar" };
    } catch (error) {
        return { success: false, error: "Erro de conexão" };
    }
}

// Deleta um fornecedor
async function deletarFornecedor(id) {
    try {
        const response = await fetch(`${API_URL}/fornecedores/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.ok) return { success: true };
        return { success: false, error: "Erro ao excluir" };
    } catch (error) {
        return { success: false, error: "Erro de conexão" };
    }
}

// ========================================
// 3. OUTRAS FUNÇÕES (Estoque, Envios...)
// ========================================

async function listarEstoque() {
    try {
        const response = await fetch(`${API_URL}/sementes`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) return await response.json();
        return [];
    } catch (error) { return []; }
}

async function buscarSementes(termo) {
    try {
        const response = await fetch(`${API_URL}/sementes/buscar?nome=${termo}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) return await response.json();
        return [];
    } catch (error) { return []; }
}

// ========================================
// 4. UTILITÁRIOS
// ========================================

function verificarAutenticacao() {
    if (!estaLogado()) {
        window.location.href = 'index.html'; 
    }
}
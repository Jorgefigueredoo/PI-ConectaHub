document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Proteção de Autenticação
    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    } else {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "index.html";
    }

    // --- ELEMENTOS DA PÁGINA ---
    const botaoAdicionar = document.getElementById('btn-novo-fornecedor');
    const containerLista = document.getElementById('lista-fornecedores'); 
    
    // Elementos do Modal
    const modal = document.getElementById('modal-fornecedor');
    const btnFecharModal = document.querySelector('.close-modal');
    const btnCancelarModal = document.querySelector('.btn-cancel');
    const btnSalvarModal = document.getElementById('btn-salvar-modal');
    
    // Campos do Modal
    const inputRazao = document.getElementById('modal-razao');
    const inputCnpj = document.getElementById('modal-cnpj');
    const inputId = document.getElementById('fornecedor-id');
    const tituloModal = document.getElementById('modal-titulo');

    // --- CONTROLE DO MODAL ---
    
    function abrirModal(modo = 'criar', fornecedor = null) {
        modal.style.display = 'flex';
        
        if (modo === 'editar' && fornecedor) {
            tituloModal.textContent = "Editar Fornecedor";
            inputId.value = fornecedor.id;
            inputRazao.value = fornecedor.razaoSocial;
            inputCnpj.value = fornecedor.cnpj;
        } else {
            tituloModal.textContent = "Novo Fornecedor";
            inputId.value = '';
            inputRazao.value = '';
            inputCnpj.value = '';
        }
        
        inputRazao.focus();
    }

    function fecharModal() {
        modal.style.display = 'none';
    }

    // Eventos do Modal
    if (botaoAdicionar) botaoAdicionar.addEventListener('click', () => abrirModal('criar'));
    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', fecharModal);
    
    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // --- AÇÃO: SALVAR (CRIAR OU EDITAR) ---
    if (btnSalvarModal) {
        btnSalvarModal.addEventListener('click', async () => {
            const razao = inputRazao.value.trim();
            const cnpj = inputCnpj.value.replace(/\D/g, ''); // Limpa pontuação
            const id = inputId.value;

            // Validações
            if (razao.length < 3) return alert("Razão Social muito curta.");
            if (cnpj.length !== 14) return alert("CNPJ inválido (deve ter 14 dígitos).");

            // Feedback visual
            const textoOriginal = btnSalvarModal.innerText;
            btnSalvarModal.innerText = "Salvando...";
            btnSalvarModal.disabled = true;

            let resultado;
            
            // Decide se cria ou edita baseado se tem ID
            if (id) {
                resultado = await atualizarFornecedor(id, razao, cnpj);
            } else {
                resultado = await criarFornecedor(razao, cnpj);
            }

            if (resultado.success) {
                alert(id ? "Fornecedor atualizado!" : "Fornecedor cadastrado!");
                fecharModal();
                carregarFornecedores();
            } else {
                alert("Erro: " + resultado.error);
            }

            btnSalvarModal.innerText = textoOriginal;
            btnSalvarModal.disabled = false;
        });
    }

    // --- CARREGAMENTO DA LISTA ---
    async function carregarFornecedores() {
        if (!containerLista) return;
        containerLista.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">Carregando...</p>';

        try {
            const fornecedores = await listarFornecedores();
            containerLista.innerHTML = '';

            if (fornecedores.length === 0) {
                containerLista.innerHTML = `<div class="supplier-item" style="justify-content: center; color: #888;">Nenhum fornecedor cadastrado.</div>`;
                return;
            }

            fornecedores.forEach(f => criarItemVisual(f));

        } catch (error) {
            console.error(error);
            containerLista.innerHTML = '<p style="color: red; text-align: center;">Erro de conexão.</p>';
        }
    }

    function criarItemVisual(fornecedor) {
        const div = document.createElement('div');
        div.className = 'supplier-item';
        div.innerHTML = `
            <div class="supplier-name">${fornecedor.razaoSocial}</div>
            <div class="supplier-cnpj">${formatarCNPJ(fornecedor.cnpj)}</div>
            <div class="supplier-actions" style="display: flex; gap: 15px;">
                <i class="fas fa-edit btn-icon-edit" style="color: #3a5a8a; cursor: pointer;" title="Editar"></i>
                <i class="fas fa-trash btn-icon-del" style="color: #ff6b6b; cursor: pointer;" title="Excluir"></i>
            </div>
        `;

        // Eventos dos botões da linha
        div.querySelector('.btn-icon-edit').addEventListener('click', () => abrirModal('editar', fornecedor));
        div.querySelector('.btn-icon-del').addEventListener('click', () => confirmarExclusao(fornecedor));

        containerLista.appendChild(div);
    }

    // --- AÇÃO: EXCLUIR ---
    async function confirmarExclusao(fornecedor) {
        if (confirm(`Excluir "${fornecedor.razaoSocial}"?`)) {
            const res = await deletarFornecedor(fornecedor.id);
            if (res.success) {
                carregarFornecedores();
            } else {
                alert("Erro ao excluir: " + res.error);
            }
        }
    }

    function formatarCNPJ(v) {
        return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    // Inicializa
    carregarFornecedores();
});
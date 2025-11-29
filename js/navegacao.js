// ========================================
// NAVEGAÇÃO GLOBAL DA SIDEBAR
// Este arquivo deve ser carregado em TODAS as páginas
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURAÇÃO DE ROTAS ---
    const rotas = {
        'painel': 'painel_de_controle.html',
        'envios': 'envios.html',
        'buscar': 'buscar.html', // Você pode criar esta página depois
        'relatorio': 'relatorio.html',
        'estoque': 'estoque.html',
        'gestao': 'gestao.html'
    };

    // --- ATUALIZAR TODOS OS LINKS DA SIDEBAR ---
    function configurarSidebar() {
        const sidebarNav = document.querySelector('.sidebar-nav');
        
        if (!sidebarNav) return;

        // Atualiza os links
        const navItems = sidebarNav.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const link = item.querySelector('a');
            const icone = link.querySelector('i');
            
            if (!link || !icone) return;

            // Identifica qual página é baseado no ícone
            let pagina = null;
            
            if (icone.classList.contains('fa-home')) {
                pagina = 'painel';
            } else if (icone.classList.contains('fa-truck')) {
                pagina = 'envios';
            } else if (icone.classList.contains('fa-search')) {
                pagina = 'buscar';
            } else if (icone.classList.contains('fa-chart-pie')) {
                pagina = 'relatorio';
            } else if (icone.classList.contains('fa-box')) {
                pagina = 'estoque';
            } else if (icone.classList.contains('fa-cog')) {
                pagina = 'gestao';
            }

            if (pagina && rotas[pagina]) {
                link.href = rotas[pagina];
            }
        });

        // Marca a página atual como ativa
        marcarPaginaAtiva();
    }

    // --- MARCAR PÁGINA ATUAL COMO ATIVA ---
    function marcarPaginaAtiva() {
        const paginaAtual = window.location.pathname.split("/").pop();
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

        navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href');

            if (href === paginaAtual) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // --- BOTÃO DE BUSCAR (AÇÃO ESPECIAL) ---
    function configurarBotaoBuscar() {
        const btnBuscar = document.querySelector('.nav-item a[href*="buscar"]');
        
        if (btnBuscar) {
            btnBuscar.addEventListener('click', function(e) {
                e.preventDefault();
                
                const codigoLote = prompt("Digite o código do lote que deseja buscar:");
                
                if (codigoLote && codigoLote.trim() !== "") {
                    buscarLoteGlobal(codigoLote.trim());
                }
            });
        }
    }

    // --- FUNÇÃO DE BUSCA GLOBAL DE LOTE ---
    async function buscarLoteGlobal(codigoLote) {
        if (typeof buscarEnvioPorCodigo !== 'function') {
            alert('❌ Função de busca não disponível. Verifique se api.js está carregado.');
            return;
        }

        const resultado = await buscarEnvioPorCodigo(codigoLote);
        
        if (resultado.success) {
            const envio = resultado.data.envio;
            const historico = resultado.data.historico;
            
            exibirDetalhesLote(envio, historico);
        } else {
            alert(`❌ ${resultado.error}`);
        }
    }

    // --- EXIBIR DETALHES DO LOTE (MODAL CUSTOMIZADO) ---
    function exibirDetalhesLote(envio, historico) {
        let mensagem = `📦 DETALHES DO LOTE: ${envio.codigoLote}\n\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `Agricultor: ${envio.agricultor.nome}\n`;
        mensagem += `CPF/CNPJ: ${envio.agricultor.cpfCnpj}\n`;
        mensagem += `Município: ${envio.agricultor.municipio} - ${envio.agricultor.uf}\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `Semente: ${envio.semente.tipoSemente}\n`;
        mensagem += `Quantidade: ${envio.quantidadeEnviadaKg} kg\n`;
        mensagem += `Status Atual: ${traduzirStatus(envio.status)}\n`;
        mensagem += `Data de Criação: ${formatarData(envio.dataCriacao)}\n\n`;
        
        if (historico && historico.length > 0) {
            mensagem += `📋 HISTÓRICO DE MOVIMENTAÇÃO:\n`;
            mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            historico.forEach((h, index) => {
                mensagem += `${index + 1}. ${formatarData(h.dataHora)}\n`;
                mensagem += `   Status: ${traduzirStatus(h.status)}\n`;
                if (h.descricao) {
                    mensagem += `   ${h.descricao}\n`;
                }
                mensagem += `\n`;
            });
        }
        
        alert(mensagem);
    }

    // --- FUNÇÕES AUXILIARES ---
    function traduzirStatus(status) {
        const traducoes = {
            'CRIADO': '🆕 Criado',
            'EM_TRANSITO': '🚚 Em Trânsito',
            'ENTREGUE': '📦 Entregue',
            'CONFIRMADO': '✅ Confirmado pelo Agricultor'
        };
        return traducoes[status] || status;
    }

    function formatarData(dataString) {
        if (!dataString) return 'N/A';
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // --- BOTÃO DE NOTIFICAÇÕES (SE EXISTIR) ---
    function configurarNotificacoes() {
        const btnNotificacao = document.querySelector('.notification-btn');
        
        if (btnNotificacao) {
            btnNotificacao.addEventListener('click', function() {
                alert('🔔 Você tem 0 notificações não lidas');
                // Aqui você pode implementar um dropdown de notificações
            });
        }
    }

    // --- BOTÃO DE LOGOUT (SE EXISTIR) ---
    function configurarLogout() {
        // Procura por botão de logout em qualquer lugar da página
        const btnLogout = document.querySelector('[data-action="logout"], .btn-logout, #btn-logout');
        
        if (btnLogout) {
            btnLogout.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (confirm('Deseja realmente sair?')) {
                    if (typeof fazerLogout === 'function') {
                        fazerLogout();
                    } else {
                        localStorage.removeItem('token');
                        window.location.href = 'login.html';
                    }
                }
            });
        }
    }

    // --- EXECUTAR CONFIGURAÇÕES ---
    configurarSidebar();
    configurarBotaoBuscar();
    configurarNotificacoes();
    configurarLogout();
});
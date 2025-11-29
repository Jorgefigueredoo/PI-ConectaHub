# 🌾 ConectaHub - Sistema de Gestão de Distribuição de Sementes

Sistema web completo para gerenciamento e rastreamento de distribuição de sementes para agricultores, desenvolvido como projeto integrador.

## 📋 Sobre o Projeto

O **ConectaHub** é uma plataforma que conecta distribuidores de sementes aos agricultores, permitindo o controle completo de envios, rastreamento de lotes, gestão de estoque e geração de relatórios operacionais.

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação** (Login e Cadastro com JWT)
- 📦 **Gestão de Envios** - Registrar e acompanhar entregas
- 🔍 **Rastreamento de Lotes** - Timeline completa de movimentação
- 📊 **Painel de Controle** - Dashboard com métricas em tempo real
- 🏪 **Controle de Estoque** - Monitoramento de sementes disponíveis
- 🏢 **Gestão de Fornecedores** - CRUD completo de fornecedores
- 📄 **Relatórios em PDF** - Geração automática de documentos
- 🔔 **Atividades Recentes** - Feed de últimas movimentações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização com design moderno
- **JavaScript (ES6+)** - Lógica de negócio e integração com API
- **Font Awesome** - Biblioteca de ícones
- **Google Fonts (Poppins)** - Tipografia

### Backend (Integração)
- **Java Spring Boot** - API RESTful
- **Spring Security** - Autenticação JWT
- **JPA/Hibernate** - Persistência de dados
- **PostgreSQL/MySQL** - Banco de dados relacional
- **iText PDF** - Geração de relatórios

## 📁 Estrutura do Projeto

```
PI-ConectaHub/
│
├── css/
│   ├── login.css              # Estilos da tela de login
│   ├── painel_de_controle.css # Dashboard principal
│   ├── envios.css             # Formulário de envios
│   ├── rastreio.css           # Timeline de rastreamento
│   ├── estoque.css            # Tabela de estoque
│   ├── gestao.css             # Gestão de fornecedores
│   ├── relatorio.css          # Gerador de relatórios
│   └── sidebar.css            # Menu lateral (global)
│
├── js/
│   ├── api.js                 # Configuração base e funções da API
│   ├── login.js               # Lógica de autenticação
│   ├── cadastro.js            # Registro de usuários
│   ├── painel_de_controle.js  # Dashboard e métricas
│   ├── envios.js              # Criação de envios
│   ├── rastreio.js            # Busca e timeline
│   ├── estoque.js             # Controle de inventário
│   ├── gestao.js              # CRUD de fornecedores
│   └── relatorio.js           # Geração de PDFs
│
├── login.html                 # Página de login
├── cadastro.html              # Página de cadastro
├── painel_de_controle.html    # Dashboard principal
├── envios.html                # Formulário de novo envio
├── rastreio.html              # Rastreamento de lotes
├── estoque.html               # Controle de estoque
├── gestao.html                # Gestão de fornecedores
├── relatorio.html             # Geração de relatórios
└── README.md                  # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge)
- Backend Java Spring Boot rodando
- Banco de dados configurado

### Configuração do Backend

1. Configure a URL da API no arquivo `js/api.js`:

```javascript
const API_URL = 'http://localhost:8080/api';
```

2. Certifique-se de que o backend está rodando na porta configurada

### Executando o Frontend

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/PI-ConectaHub.git
```

2. Abra o arquivo `login.html` diretamente no navegador ou use um servidor local:

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (Live Server)
npx live-server

# Opção 3: PHP
php -S localhost:8000
```

3. Acesse no navegador:
```
http://localhost:8000/login.html
```

## 👤 Credenciais de Teste

Para testar o sistema, cadastre um novo usuário ou utilize credenciais do banco de dados.

## 📱 Telas do Sistema

### 1. Login e Cadastro
- Interface moderna com ilustração
- Validação de campos
- Feedback visual de erros

### 2. Painel de Controle
- Cards com métricas (Em Trânsito, Entregues, Confirmados)
- Feed de atividades recentes
- Botões de ação rápida

### 3. Envios
- Busca de agricultores com autocomplete
- Seleção de sementes do estoque
- Geração automática de código de lote

### 4. Rastreamento
- Busca por código de lote
- Timeline vertical com histórico
- Status coloridos (Criado, Em Trânsito, Entregue)

### 5. Estoque
- Tabela com status visual (Disponível, Baixo, Sem Estoque)
- Busca integrada ao backend
- Indicadores de cores

### 6. Gestão de Fornecedores
- Lista com razão social e CNPJ formatado
- Modal para criar/editar
- Botões de ação (Editar/Excluir)

### 7. Relatórios
- Filtros por período, município, cliente
- Geração e download de PDF
- Integração com backend

## 🔒 Segurança

- ✅ Autenticação via JWT (JSON Web Token)
- ✅ Proteção de rotas com verificação de token
- ✅ Headers de autorização em todas as requisições
- ✅ Redirecionamento automático ao expirar sessão
- ✅ Validação de dados no frontend e backend

## 🎨 Design System

### Cores Principais
- **Azul Escuro:** `#1a3a68` (Primário)
- **Azul Médio:** `#3a5a8a` (Secundário)
- **Bege/Amarelo:** `#ffedd0` (Cards)
- **Cinza Claro:** `#f0f2f5` (Fundo)

### Tipografia
- **Família:** Poppins
- **Pesos:** 400, 500, 600, 700, 800

## 📦 Funcionalidades da API Integrada

### Endpoints Principais

```javascript
// Autenticação
POST /api/auth/login
POST /api/auth/register

// Envios
GET  /api/envios
POST /api/envios
GET  /api/envios/buscar/{codigo}

// Estoque
GET  /api/sementes
GET  /api/sementes/buscar?nome={termo}

// Fornecedores
GET    /api/fornecedores
POST   /api/fornecedores
PUT    /api/fornecedores/{id}
DELETE /api/fornecedores/{id}

// Relatórios
POST /api/relatorios/gerar

// Dashboard
GET /api/dashboard/resumo
```

## 🐛 Resolução de Problemas

### Erro de CORS
Se encontrar erros de CORS, configure o backend para aceitar requisições do frontend:

```java
@CrossOrigin(origins = "http://localhost:8000")
```

### Token Expirado
O sistema redireciona automaticamente para login quando o token expira.

### Imagens não carregam
Certifique-se de que os arquivos de imagem (`Agricultor.png`, `logo_conectahub_branco.png`) estão na pasta raiz.

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido como trabalho acadêmico integrador.

Equipe:
Jorge Antonio,
Lucas Souza,
Luiz Eduardo,
Kauan Nicolas,
Matheus Paulo e 
Vínicius Trezena

## 📄 Licença

Este projeto é de uso educacional para fins acadêmicos.

---

**Desenvolvido com ❤️ para conectar distribuidores e agricultores através da tecnologia**

// Script para o sistema de Login
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const btnLogin = document.querySelector('.btn-login');

    // Verificar se já está logado (apenas se estiver na página de login)
    if (window.location.pathname.includes('login.html') && isAuthenticated()) {
        redirectToAdmin();
        return;
    }

    // Configurar evento de submit do formulário
    loginForm.addEventListener('submit', handleLogin);

    // Configurar eventos de input para melhor UX
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            hideError();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin(e);
            }
        });
    });
});

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username').trim();
    const password = formData.get('password');

    const btnLogin = document.querySelector('.btn-login');

    // Validação básica
    if (!username || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    // Mostrar loading
    btnLogin.classList.add('loading');
    btnLogin.textContent = 'Entrando...';

    // Simular delay de autenticação (em produção, seria uma chamada para API)
    setTimeout(() => {
        if (authenticateUser(username, password)) {
            // Login bem-sucedido
            setAuthenticated(true);
            redirectToAdmin();
        } else {
            // Login falhou
            showError('Usuário ou senha incorretos. Tente novamente.');
            btnLogin.classList.remove('loading');
            btnLogin.textContent = 'Entrar';
        }
    }, 1000);
}

// Função de autenticação
function authenticateUser(username, password) {
    // Credenciais padrão (em produção, isso viria de um servidor seguro)
    const defaultCredentials = {
        username: 'analivia',
        password: '15022008'
    };

    // Verificar se as credenciais estão corretas
    const isValid = username === defaultCredentials.username &&
        password === defaultCredentials.password;

    // Log de tentativa de login (em produção, seria enviado para servidor)
    console.log(`Tentativa de login: ${username} - ${isValid ? 'Sucesso' : 'Falha'}`);

    return isValid;
}

// Função para verificar se está autenticado
function isAuthenticated() {
    const authToken = localStorage.getItem('adminAuthToken');
    const authExpiry = localStorage.getItem('adminAuthExpiry');

    if (!authToken || !authExpiry) {
        return false;
    }

    // Verificar se o token não expirou
    const now = new Date().getTime();
    const expiry = parseInt(authExpiry);

    if (now > expiry) {
        // Token expirado, limpar dados
        clearAuthData();
        return false;
    }

    return true;
}

// Função para definir autenticação
function setAuthenticated(authenticated) {
    if (authenticated) {
        // Gerar token simples (em produção, seria um JWT do servidor)
        const token = generateAuthToken();
        const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 horas

        localStorage.setItem('adminAuthToken', token);
        localStorage.setItem('adminAuthExpiry', expiry.toString());
        localStorage.setItem('adminLoginTime', new Date().toISOString());
    } else {
        clearAuthData();
    }
}

// Função para gerar token de autenticação
function generateAuthToken() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}-${random}-livia-admin`).replace(/[^a-zA-Z0-9]/g, '');
}

// Função para limpar dados de autenticação
function clearAuthData() {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminAuthExpiry');
    localStorage.removeItem('adminLoginTime');
}

// Função para redirecionar para o painel admin
function redirectToAdmin() {
    window.location.href = 'admin.html';
}

// Função para mostrar erro
function showError(message) {
    const loginError = document.getElementById('login-error');
    const errorText = loginError.querySelector('p');

    errorText.textContent = message;
    loginError.style.display = 'block';

    // Focar no primeiro campo de input
    const firstInput = document.querySelector('#login-form input');
    if (firstInput) {
        firstInput.focus();
    }
}

// Função para esconder erro
function hideError() {
    const loginError = document.getElementById('login-error');
    loginError.style.display = 'none';
}

// Função para logout (usada no admin.js)
function logout() {
    clearAuthData();
    window.location.href = 'login.html';
}

// Proteção será feita apenas no DOMContentLoaded para evitar loops

// Proteção adicional para verificar autenticação em páginas admin
document.addEventListener('DOMContentLoaded', function () {
    // Se estiver na página de admin e não estiver autenticado, redirecionar
    if (window.location.pathname.includes('admin.html') && !isAuthenticated()) {
        window.location.href = 'login.html';
    }
});

// Função para verificar sessão periodicamente (usada no admin.js)
function checkSession() {
    if (!isAuthenticated()) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        logout();
    }
}

// Exportar funções para uso em outros scripts
window.authUtils = {
    isAuthenticated,
    setAuthenticated,
    clearAuthData,
    logout,
    checkSession
};

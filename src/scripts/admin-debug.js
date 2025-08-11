// Versão simplificada do admin.js para debug

console.log('🔍 Admin Debug - Iniciando...');

// Verificar se authUtils existe
if (typeof authUtils !== 'undefined') {
    console.log('✅ authUtils encontrado');
} else {
    console.log('❌ authUtils NÃO encontrado');
}

// Verificar autenticação
if (typeof authUtils !== 'undefined' && authUtils.isAuthenticated) {
    const isAuth = authUtils.isAuthenticated();
    console.log('🔐 Autenticado:', isAuth);

    if (!isAuth) {
        console.log('⚠️ Não autenticado - redirecionando para login');
        window.location.href = 'login.html';
    }
} else {
    console.log('⚠️ authUtils não disponível - verificando localStorage diretamente');

    const authToken = localStorage.getItem('adminAuthToken');
    const authExpiry = localStorage.getItem('adminAuthExpiry');

    if (!authToken || !authExpiry) {
        console.log('❌ Sem token de autenticação');
        window.location.href = 'login.html';
    } else {
        const now = new Date().getTime();
        const expiry = parseInt(authExpiry);

        if (now > expiry) {
            console.log('❌ Token expirado');
            localStorage.removeItem('adminAuthToken');
            localStorage.removeItem('adminAuthExpiry');
            localStorage.removeItem('adminLoginTime');
            window.location.href = 'login.html';
        } else {
            console.log('✅ Token válido');
        }
    }
}

// Função para verificar se um elemento existe
function getElementSafely(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ Elemento com ID '${id}' não encontrado`);
        return null;
    }
    return element;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM carregado - iniciando admin...');

    try {
        // Verificar elementos essenciais
        const elementos = [
            'total-agendamentos',
            'agendamentos-hoje',
            'agendamentos-semana',
            'horarios-disponiveis',
            'dias-calendario-admin',
            'mes-atual-admin'
        ];

        elementos.forEach(id => {
            const element = getElementSafely(id);
            if (element) {
                console.log(`✅ ${id}: encontrado`);
            } else {
                console.log(`❌ ${id}: NÃO encontrado`);
            }
        });

        // Teste básico de dashboard
        console.log('📊 Testando dashboard...');
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        console.log('📅 Agendamentos carregados:', agendamentos.length);

        // Atualizar estatísticas básicas
        const totalElement = getElementSafely('total-agendamentos');
        if (totalElement) {
            totalElement.textContent = agendamentos.length;
            console.log('✅ Total de agendamentos atualizado');
        }

        // Teste de calendário básico
        console.log('📅 Testando calendário...');
        const diasCalendario = getElementSafely('dias-calendario-admin');
        if (diasCalendario) {
            diasCalendario.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Calendário carregado com sucesso!</div>';
            console.log('✅ Calendário básico carregado');
        }

        console.log('🎉 Admin Debug - Inicialização concluída com sucesso!');

    } catch (error) {
        console.error('💥 Erro na inicialização:', error);
    }
});

// Logout simples
function logout() {
    console.log('🚪 Logout...');
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminAuthExpiry');
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'login.html';
}

// Expor função de logout globalmente
window.logout = logout;

// Versão super simplificada do admin.js

console.log('🚀 Admin Super Simples - Iniciando...');

// Verificar se estamos na página correta
if (!window.location.pathname.includes('admin')) {
    console.log('⚠️ Não estamos na página admin');
} else {
    console.log('✅ Estamos na página admin');
}

// Verificar autenticação básica
const authToken = localStorage.getItem('adminAuthToken');
const authExpiry = localStorage.getItem('adminAuthExpiry');

console.log('🔐 Token:', authToken ? 'Existe' : 'Não existe');
console.log('⏰ Expiry:', authExpiry ? 'Existe' : 'Não existe');

if (!authToken || !authExpiry) {
    console.log('❌ Sem autenticação - redirecionando para login');
    window.location.href = 'login.html';
} else {
    const now = new Date().getTime();
    const expiry = parseInt(authExpiry);

    if (now > expiry) {
        console.log('❌ Token expirado - redirecionando para login');
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminAuthExpiry');
        localStorage.removeItem('adminLoginTime');
        window.location.href = 'login.html';
    } else {
        console.log('✅ Token válido - continuando...');
    }
}

// Função simples para verificar elementos
function verificarElemento(id) {
    const element = document.getElementById(id);
    if (element) {
        console.log(`✅ ${id}: encontrado`);
        return element;
    } else {
        console.log(`❌ ${id}: NÃO encontrado`);
        return null;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM carregado - iniciando admin super simples...');

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

        elementos.forEach(verificarElemento);

        // Teste básico de dashboard
        console.log('📊 Testando dashboard...');
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        console.log('📅 Agendamentos carregados:', agendamentos.length);

        // Atualizar estatísticas básicas
        const totalElement = verificarElemento('total-agendamentos');
        if (totalElement) {
            totalElement.textContent = agendamentos.length;
            console.log('✅ Total de agendamentos atualizado');
        }

        // Teste de calendário básico
        console.log('📅 Testando calendário...');
        const diasCalendario = verificarElemento('dias-calendario-admin');
        if (diasCalendario) {
            diasCalendario.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666; background: #f8f9fa; border-radius: 10px;">🎉 Calendário carregado com sucesso!</div>';
            console.log('✅ Calendário básico carregado');
        }

        console.log('🎉 Admin Super Simples - Inicialização concluída com sucesso!');

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

// Script para o Painel Administrativo

// Variáveis globais
let mesAtualAdmin = new Date().getMonth();
let anoAtualAdmin = new Date().getFullYear();
let agendamentoEditando = null;
let diaSelecionado = null; // Nova variável para controlar o dia selecionado

// Função para verificar se um elemento existe antes de usar
function getElementSafely(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Elemento com ID '${id}' não encontrado`);
        return null;
    }
    return element;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    // Verificação de autenticação
    if (typeof authUtils !== 'undefined' && !authUtils.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    inicializarAdmin();

    // Configurar verificação periódica de sessão
    setInterval(() => {
        if (typeof authUtils !== 'undefined' && !authUtils.isAuthenticated()) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            authUtils.logout();
        }
    }, 60000); // Verificar a cada minuto
});

function inicializarAdmin() {
    try {
        // Inicializar tabs
        inicializarTabs();

        // Carregar dados iniciais
        atualizarDashboard();
        carregarAgendamentos();
        gerarCalendarioAdmin();

        // Configurar event listeners
        configurarEventListeners();

        // Carregar configurações
        carregarConfiguracoes();
    } catch (error) {
        console.error('Erro ao inicializar admin:', error);
    }
}

// Sistema de Tabs
function inicializarTabs() {
    try {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                const targetPane = document.getElementById(targetTab);

                if (!targetPane) {
                    console.warn(`Tab pane '${targetTab}' não encontrado`);
                    return;
                }

                // Remover classe active de todos os botões e painéis
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Adicionar classe active ao botão clicado e painel correspondente
                btn.classList.add('active');
                targetPane.classList.add('active');
            });
        });
    } catch (error) {
        console.error('Erro ao inicializar tabs:', error);
    }
}

// Dashboard - Atualizar estatísticas
function atualizarDashboard() {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const hoje = new Date().toISOString().split('T')[0];

        // Total de agendamentos
        const totalElement = getElementSafely('total-agendamentos');
        if (totalElement) totalElement.textContent = agendamentos.length;

        // Agendamentos de hoje
        const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
        const hojeElement = getElementSafely('agendamentos-hoje');
        if (hojeElement) hojeElement.textContent = agendamentosHoje.length;

        // Agendamentos da semana
        const inicioSemana = new Date();
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(fimSemana.getDate() + 6);

        const agendamentosSemana = agendamentos.filter(a => {
            const dataAgendamento = new Date(a.data);
            return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana;
        });
        const semanaElement = getElementSafely('agendamentos-semana');
        if (semanaElement) semanaElement.textContent = agendamentosSemana.length;

        // Horários disponíveis hoje
        const horariosDisponiveis = getHorariosDisponiveis(hoje);
        const disponiveisElement = getElementSafely('horarios-disponiveis');
        if (disponiveisElement) disponiveisElement.textContent = horariosDisponiveis.length;
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

// Carregar e exibir agendamentos
function carregarAgendamentos() {
    try {
        // Como não há tabela de agendamentos no HTML atual, 
        // apenas carregamos os dados para uso no calendário
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

        // Ordenar por data e hora para uso no calendário
        agendamentos.sort((a, b) => {
            const dataA = new Date(a.data + 'T' + a.hora);
            const dataB = new Date(b.data + 'T' + b.hora);
            return dataA - dataB;
        });

        console.log('Agendamentos carregados:', agendamentos.length);
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Função para formatar data (reutilizada do main.js)
function formatarData(dataISO) {
    try {
        if (!dataISO || typeof dataISO !== 'string') {
            return 'Data inválida';
        }

        if (dataISO.includes('/')) {
            return dataISO;
        }

        const partes = dataISO.split('-');
        if (partes.length !== 3) {
            return dataISO;
        }

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
            return dataISO;
        }

        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dataISO;
    }
}

// Função para obter horários disponíveis (reutilizada do main.js)
function getHorariosDisponiveis(data) {
    try {
        const HORARIOS_DISPONIVEIS = [
            '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];

        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const agendamentosDoDia = agendamentos.filter(a => a.data === data);
        const horariosOcupados = agendamentosDoDia.map(a => a.hora);

        return HORARIOS_DISPONIVEIS.filter(horario => !horariosOcupados.includes(horario));
    } catch (error) {
        console.error('Erro ao obter horários disponíveis:', error);
        return [];
    }
}

// Editar agendamento
function editarAgendamento(index) {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const agendamento = agendamentos[index];

        if (!agendamento) return;

        agendamentoEditando = index;

        // Preencher formulário
        const nomeInput = getElementSafely('edit-nome');
        const telefoneInput = getElementSafely('edit-telefone');
        const dataInput = getElementSafely('edit-data');
        const horaInput = getElementSafely('edit-hora');
        const servicoInput = getElementSafely('edit-servico');
        const statusInput = getElementSafely('edit-status');

        if (nomeInput) nomeInput.value = agendamento.nome;
        if (telefoneInput) telefoneInput.value = agendamento.telefone;
        if (dataInput) dataInput.value = agendamento.data;
        if (horaInput) horaInput.value = agendamento.hora;
        if (servicoInput) servicoInput.value = agendamento.servico;
        if (statusInput) statusInput.value = agendamento.status || 'pendente';

        // Mostrar modal
        const modal = getElementSafely('modal-editar');
        if (modal) modal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao editar agendamento:', error);
    }
}

// Excluir agendamento
function excluirAgendamento(index) {
    try {
        if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        agendamentos.splice(index, 1);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        carregarAgendamentos();
        atualizarDashboard();
        gerarCalendarioAdmin();

        alert('Agendamento excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
    }
}

// Confirmar agendamento
function confirmarAgendamento(index) {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        agendamentos[index].status = 'confirmado';
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        carregarAgendamentos();
        atualizarDashboard();
        gerarCalendarioAdmin();

        alert('Agendamento confirmado com sucesso!');
    } catch (error) {
        console.error('Erro ao confirmar agendamento:', error);
    }
}

// Fechar modal
function fecharModal() {
    try {
        const modal = getElementSafely('modal-editar');
        if (modal) modal.style.display = 'none';
        agendamentoEditando = null;
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
}

// Gerar calendário administrativo
function gerarCalendarioAdmin() {
    try {
        const diasCalendario = getElementSafely('dias-calendario-admin');
        const mesAtualElement = getElementSafely('mes-atual-admin');

        if (!diasCalendario || !mesAtualElement) return;

        // Esconder detalhes e resetar seleção quando mudar de mês
        esconderDetalhesDia();
        diaSelecionado = null;

        const nomesMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        mesAtualElement.textContent = `${nomesMeses[mesAtualAdmin]} ${anoAtualAdmin}`;

        const primeiroDia = new Date(anoAtualAdmin, mesAtualAdmin, 1);
        const ultimoDia = new Date(anoAtualAdmin, mesAtualAdmin + 1, 0);
        const diaSemanaInicio = primeiroDia.getDay();
        const totalDias = ultimoDia.getDate();

        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const agendamentosPorDia = {};

        agendamentos.forEach(agendamento => {
            const partes = agendamento.data.split('-');
            if (partes.length === 3) {
                const anoAgendamento = parseInt(partes[0]);
                const mesAgendamento = parseInt(partes[1]) - 1;
                const diaAgendamento = parseInt(partes[2]);

                if (mesAgendamento === mesAtualAdmin && anoAgendamento === anoAtualAdmin) {
                    if (!agendamentosPorDia[diaAgendamento]) {
                        agendamentosPorDia[diaAgendamento] = [];
                    }
                    agendamentosPorDia[diaAgendamento].push(agendamento);
                }
            }
        });

        diasCalendario.innerHTML = '';

        // Dias do mês anterior
        const ultimoDiaMesAnterior = new Date(anoAtualAdmin, mesAtualAdmin, 0).getDate();
        for (let i = diaSemanaInicio - 1; i >= 0; i--) {
            const dia = document.createElement('div');
            dia.className = 'dia-calendario-admin outro-mes';
            dia.textContent = ultimoDiaMesAnterior - i;
            diasCalendario.appendChild(dia);
        }

        // Dias do mês atual
        const hoje = new Date();
        for (let dia = 1; dia <= totalDias; dia++) {
            const diaElement = document.createElement('div');
            diaElement.className = 'dia-calendario-admin';
            diaElement.textContent = dia;

            // Marcar como hoje
            if (dia === hoje.getDate() && mesAtualAdmin === hoje.getMonth() && anoAtualAdmin === hoje.getFullYear()) {
                diaElement.classList.add('hoje');
            }

            // Marcar dias com agendamentos
            if (agendamentosPorDia[dia]) {
                diaElement.classList.add('com-agendamento');
                const tooltipText = `${agendamentosPorDia[dia].length} agendamento(s)`;
                diaElement.title = tooltipText;
            }

            // Event listener para selecionar dia e mostrar detalhes
            diaElement.addEventListener('click', () => {
                selecionarDia(dia, agendamentosPorDia[dia] || []);
            });

            diasCalendario.appendChild(diaElement);
        }

        // Dias do próximo mês
        const diasRestantes = 42 - (diaSemanaInicio + totalDias);
        for (let dia = 1; dia <= diasRestantes; dia++) {
            const diaElement = document.createElement('div');
            diaElement.className = 'dia-calendario-admin outro-mes';
            diaElement.textContent = dia;
            diasCalendario.appendChild(diaElement);
        }
    } catch (error) {
        console.error('Erro ao gerar calendário admin:', error);
    }
}

// Selecionar um dia no calendário
function selecionarDia(dia, agendamentos) {
    try {
        // Remover seleção anterior
        const diasAnteriores = document.querySelectorAll('.dia-calendario-admin.selecionado');
        diasAnteriores.forEach(diaAnterior => {
            diaAnterior.classList.remove('selecionado');
        });

        // Se clicou no mesmo dia, deselecionar
        if (diaSelecionado === dia) {
            diaSelecionado = null;
            esconderDetalhesDia();
            return;
        }

        // Selecionar o novo dia
        diaSelecionado = dia;

        // Adicionar classe de seleção ao elemento do dia
        const diasCalendario = document.querySelectorAll('.dia-calendario-admin');
        diasCalendario.forEach(diaElement => {
            if (diaElement.textContent == dia && !diaElement.classList.contains('outro-mes')) {
                diaElement.classList.add('selecionado');
            }
        });

        // Mostrar detalhes do dia selecionado
        mostrarDetalhesDia(dia, agendamentos);
    } catch (error) {
        console.error('Erro ao selecionar dia:', error);
    }
}

// Mostrar detalhes dos agendamentos de um dia
function mostrarDetalhesDia(dia, agendamentos) {
    try {
        const detalhesDia = getElementSafely('detalhes-dia');
        const lista = getElementSafely('agendamentos-dia-lista');
        const mensagemCalendario = getElementSafely('mensagem-calendario');

        if (!detalhesDia || !lista) return;

        // Formatar a data para exibição e ISO
        const dataFormatada = `${dia.toString().padStart(2, '0')}/${(mesAtualAdmin + 1).toString().padStart(2, '0')}/${anoAtualAdmin}`;
        const dataISO = `${anoAtualAdmin}-${(mesAtualAdmin + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        const titulo = detalhesDia.querySelector('h3');
        if (titulo) titulo.textContent = `Dia ${dataFormatada}`;

        // Obter horários disponíveis
        const horariosDisponiveis = getHorariosDisponiveis(dataISO);

        let conteudo = '';

        // Seção de horários disponíveis
        conteudo += `
            <div class="horarios-disponiveis-section">
                <h4><i class="fas fa-clock"></i> Horários Disponíveis</h4>
                <div class="horarios-grid">
        `;

        if (horariosDisponiveis.length > 0) {
            horariosDisponiveis.forEach(horario => {
                conteudo += `
                    <button class="horario-disponivel" data-horario="${horario}" data-data="${dataISO}">
                        <i class="fas fa-plus"></i>
                        ${horario}
                    </button>
                `;
            });
        } else {
            conteudo += '<p class="sem-horarios">Nenhum horário disponível para este dia.</p>';
        }

        conteudo += `
                </div>
            </div>
        `;

        // Seção de agendamentos existentes
        conteudo += `
            <div class="agendamentos-section">
                <h4><i class="fas fa-calendar-check"></i> Agendamentos Existentes</h4>
        `;

        if (agendamentos.length > 0) {
            agendamentos.forEach((agendamento, index) => {
                const status = agendamento.status || 'pendente';
                conteudo += `
                    <div class="agendamento-item">
                        <div class="agendamento-info">
                            <div class="agendamento-horario">${agendamento.hora}</div>
                            <div class="agendamento-detalhes">
                                <strong>${agendamento.nome}</strong>
                                <small>${agendamento.telefone} | ${agendamento.servico}</small>
                            </div>
                        </div>
                        <span class="status-badge status-${status}">${status}</span>
                    </div>
                `;
            });
        } else {
            conteudo += '<p class="sem-agendamentos">Nenhum agendamento para este dia.</p>';
        }

        conteudo += '</div>';

        lista.innerHTML = conteudo;

        // Adicionar event listeners aos horários disponíveis
        const horariosBtns = lista.querySelectorAll('.horario-disponivel');
        horariosBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const horario = this.getAttribute('data-horario');
                const data = this.getAttribute('data-data');
                preencherModalNovoAgendamento(data, horario);
            });
        });

        detalhesDia.style.display = 'block';
        if (mensagemCalendario) {
            mensagemCalendario.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao mostrar detalhes do dia:', error);
    }
}

// Esconder detalhes do dia
function esconderDetalhesDia() {
    try {
        const detalhesDia = getElementSafely('detalhes-dia');
        const mensagemCalendario = getElementSafely('mensagem-calendario');

        if (detalhesDia) detalhesDia.style.display = 'none';
        if (mensagemCalendario) mensagemCalendario.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao esconder detalhes do dia:', error);
    }
}

// Preencher modal para novo agendamento
function preencherModalNovoAgendamento(data, horario) {
    try {
        // Preencher campos do modal
        const dataInput = getElementSafely('edit-data');
        const horaInput = getElementSafely('edit-hora');

        if (dataInput) dataInput.value = data;
        if (horaInput) horaInput.value = horario;

        // Limpar outros campos para novo agendamento
        const nomeInput = getElementSafely('edit-nome');
        const telefoneInput = getElementSafely('edit-telefone');
        const servicoInput = getElementSafely('edit-servico');
        const statusInput = getElementSafely('edit-status');

        if (nomeInput) nomeInput.value = '';
        if (telefoneInput) telefoneInput.value = '';
        if (servicoInput) servicoInput.value = 'Fibra de vidro';
        if (statusInput) statusInput.value = 'pendente';

        // Resetar índice de edição
        agendamentoEditando = null;

        // Mostrar modal
        const modal = getElementSafely('modal-editar');
        if (modal) modal.style.display = 'flex';

        // Fechar detalhes do dia
        esconderDetalhesDia();

        // Remover seleção do dia
        const diasSelecionados = document.querySelectorAll('.dia-calendario-admin.selecionado');
        diasSelecionados.forEach(dia => dia.classList.remove('selecionado'));
        diaSelecionado = null;

    } catch (error) {
        console.error('Erro ao preencher modal para novo agendamento:', error);
    }
}

// Configurar event listeners
function configurarEventListeners() {
    try {
        // Navegação do calendário
        const mesAnteriorBtn = getElementSafely('mes-anterior-admin');
        if (mesAnteriorBtn) {
            mesAnteriorBtn.addEventListener('click', () => {
                mesAtualAdmin--;
                if (mesAtualAdmin < 0) {
                    mesAtualAdmin = 11;
                    anoAtualAdmin--;
                }
                gerarCalendarioAdmin();
            });
        }

        const mesProximoBtn = getElementSafely('mes-proximo-admin');
        if (mesProximoBtn) {
            mesProximoBtn.addEventListener('click', () => {
                mesAtualAdmin++;
                if (mesAtualAdmin > 11) {
                    mesAtualAdmin = 0;
                    anoAtualAdmin++;
                }
                gerarCalendarioAdmin();
            });
        }

        // Filtros de agendamentos (não implementados no momento)
        // const filtroData = getElementSafely('filtro-data');
        // if (filtroData) filtroData.addEventListener('change', aplicarFiltros);

        // const filtroStatus = getElementSafely('filtro-status');
        // if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);

        // Exportar agendamentos (não implementado no momento)
        // const exportarBtn = getElementSafely('exportar-agendamentos');
        // if (exportarBtn) exportarBtn.addEventListener('click', exportarAgendamentos);

        // Modal
        const closeBtn = document.querySelector('.close');
        if (closeBtn) closeBtn.addEventListener('click', fecharModal);

        const formEditar = getElementSafely('form-editar-agendamento');
        if (formEditar) formEditar.addEventListener('submit', salvarEdicao);

        // Configurações
        const salvarConfigBtn = getElementSafely('salvar-config');
        if (salvarConfigBtn) salvarConfigBtn.addEventListener('click', salvarConfiguracoes);

        const resetConfigBtn = getElementSafely('reset-config');
        if (resetConfigBtn) resetConfigBtn.addEventListener('click', resetarConfiguracoes);

        // Botão de fechar detalhes do dia
        const fecharDetalhesBtn = getElementSafely('fechar-detalhes');
        if (fecharDetalhesBtn) {
            fecharDetalhesBtn.addEventListener('click', () => {
                esconderDetalhesDia();
                // Remover seleção do dia
                const diasSelecionados = document.querySelectorAll('.dia-calendario-admin.selecionado');
                diasSelecionados.forEach(dia => dia.classList.remove('selecionado'));
                diaSelecionado = null;
            });
        }

        // Botão de logout
        const logoutBtn = getElementSafely('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (typeof authUtils !== 'undefined') {
                    authUtils.logout();
                } else {
                    // Fallback se authUtils não estiver disponível
                    localStorage.removeItem('adminAuthToken');
                    localStorage.removeItem('adminAuthExpiry');
                    localStorage.removeItem('adminLoginTime');
                    window.location.href = 'login.html';
                }
            });
        }

        // Fechar modal ao clicar fora
        window.addEventListener('click', (event) => {
            const modal = getElementSafely('modal-editar');
            if (modal && event.target === modal) {
                fecharModal();
            }
        });

        // Fechar detalhes do dia ao clicar fora (exceto no calendário)
        document.addEventListener('click', (event) => {
            const detalhesDia = getElementSafely('detalhes-dia');
            const calendarioContainer = document.querySelector('.calendario-admin-container');

            if (detalhesDia && detalhesDia.style.display === 'block' &&
                !detalhesDia.contains(event.target) &&
                calendarioContainer && !calendarioContainer.contains(event.target)) {
                esconderDetalhesDia();
                // Remover seleção do dia
                const diasSelecionados = document.querySelectorAll('.dia-calendario-admin.selecionado');
                diasSelecionados.forEach(dia => dia.classList.remove('selecionado'));
                diaSelecionado = null;
            }
        });
    } catch (error) {
        console.error('Erro ao configurar event listeners:', error);
    }
}

// Aplicar filtros aos agendamentos
function aplicarFiltros() {
    try {
        // Como não há filtros no HTML atual, esta função não faz nada
        // Mas mantemos a estrutura para futuras implementações
        console.log('Função de filtros chamada - não implementada no momento');
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

// Exportar agendamentos
function exportarAgendamentos() {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

        if (agendamentos.length === 0) {
            alert('Não há agendamentos para exportar.');
            return;
        }

        // Criar CSV
        let csv = 'Data,Hora,Cliente,Telefone,Serviço,Status\n';

        agendamentos.forEach(agendamento => {
            const dataFormatada = formatarData(agendamento.data);
            const status = agendamento.status || 'pendente';
            csv += `${dataFormatada},${agendamento.hora},${agendamento.nome},${agendamento.telefone},${agendamento.servico},${status}\n`;
        });

        // Download do arquivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `agendamentos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao exportar agendamentos:', error);
    }
}

// Salvar edição de agendamento
function salvarEdicao(event) {
    try {
        event.preventDefault();

        if (agendamentoEditando === null) return;

        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

        const nomeInput = getElementSafely('edit-nome');
        const telefoneInput = getElementSafely('edit-telefone');
        const dataInput = getElementSafely('edit-data');
        const horaInput = getElementSafely('edit-hora');
        const servicoInput = getElementSafely('edit-servico');
        const statusInput = getElementSafely('edit-status');

        if (!nomeInput || !telefoneInput || !dataInput || !horaInput || !servicoInput || !statusInput) {
            alert('Erro: Campos obrigatórios não encontrados');
            return;
        }

        agendamentos[agendamentoEditando] = {
            nome: nomeInput.value,
            telefone: telefoneInput.value,
            data: dataInput.value,
            hora: horaInput.value,
            servico: servicoInput.value,
            status: statusInput.value,
            dataCriacao: agendamentos[agendamentoEditando].dataCriacao,
            dataFormatada: formatarData(dataInput.value)
        };

        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        fecharModal();
        carregarAgendamentos();
        atualizarDashboard();
        gerarCalendarioAdmin();

        alert('Agendamento atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar edição:', error);
    }
}

// Carregar configurações
function carregarConfiguracoes() {
    try {
        const config = JSON.parse(localStorage.getItem('configuracoes')) || getConfiguracoesPadrao();

        const horarioAbertura = getElementSafely('horario-abertura');
        const horarioFechamento = getElementSafely('horario-fechamento');
        const almocoInicio = getElementSafely('almoco-inicio');
        const almocoFim = getElementSafely('almoco-fim');
        const notifWhatsapp = getElementSafely('notif-whatsapp');
        const notifEmail = getElementSafely('notif-email');
        const lembreteHoras = getElementSafely('lembrete-horas');

        if (horarioAbertura) horarioAbertura.value = config.horarioAbertura;
        if (horarioFechamento) horarioFechamento.value = config.horarioFechamento;
        if (almocoInicio) almocoInicio.value = config.almocoInicio;
        if (almocoFim) almocoFim.value = config.almocoFim;
        if (notifWhatsapp) notifWhatsapp.checked = config.notifWhatsapp;
        if (notifEmail) notifEmail.checked = config.notifEmail;
        if (lembreteHoras) lembreteHoras.value = config.lembreteHoras;

        // Carregar serviços
        config.servicos.forEach(servico => {
            const checkbox = getElementSafely(`servico-${servico.id}`);
            if (checkbox) {
                checkbox.checked = servico.ativo;
                const precoInput = checkbox.nextElementSibling.nextElementSibling;
                if (precoInput && precoInput.tagName === 'INPUT') {
                    precoInput.value = servico.preco;
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Obter configurações padrão
function getConfiguracoesPadrao() {
    return {
        horarioAbertura: '08:00',
        horarioFechamento: '17:00',
        almocoInicio: '12:00',
        almocoFim: '13:00',
        notifWhatsapp: true,
        notifEmail: false,
        lembreteHoras: 24,
        servicos: [
            { id: 'fibra', nome: 'Fibra de vidro', ativo: true, preco: 80 },
            { id: 'molde', nome: 'Molde F1', ativo: true, preco: 70 },
            { id: 'banho', nome: 'Banho em gel', ativo: true, preco: 60 },
            { id: 'manutencao', nome: 'Manutenção', ativo: true, preco: 50 },
            { id: 'esmaltacao', nome: 'Esmaltação em gel', ativo: true, preco: 40 }
        ]
    };
}

// Salvar configurações
function salvarConfiguracoes() {
    try {
        const horarioAbertura = getElementSafely('horario-abertura');
        const horarioFechamento = getElementSafely('horario-fechamento');
        const almocoInicio = getElementSafely('almoco-inicio');
        const almocoFim = getElementSafely('almoco-fim');
        const notifWhatsapp = getElementSafely('notif-whatsapp');
        const notifEmail = getElementSafely('notif-email');
        const lembreteHoras = getElementSafely('lembrete-horas');

        if (!horarioAbertura || !horarioFechamento || !almocoInicio || !almocoFim ||
            !notifWhatsapp || !notifEmail || !lembreteHoras) {
            alert('Erro: Campos de configuração não encontrados');
            return;
        }

        const config = {
            horarioAbertura: horarioAbertura.value,
            horarioFechamento: horarioFechamento.value,
            almocoInicio: almocoInicio.value,
            almocoFim: almocoFim.value,
            notifWhatsapp: notifWhatsapp.checked,
            notifEmail: notifEmail.checked,
            lembreteHoras: parseInt(lembreteHoras.value),
            servicos: [
                { id: 'fibra', nome: 'Fibra de vidro', ativo: getElementSafely('servico-fibra')?.checked || false, preco: parseFloat(document.querySelector('#servico-fibra + label + input')?.value) || 80 },
                { id: 'molde', nome: 'Molde F1', ativo: getElementSafely('servico-molde')?.checked || false, preco: parseFloat(document.querySelector('#servico-molde + label + input')?.value) || 70 },
                { id: 'banho', nome: 'Banho em gel', ativo: getElementSafely('servico-banho')?.checked || false, preco: parseFloat(document.querySelector('#servico-banho + label + input')?.value) || 60 },
                { id: 'manutencao', nome: 'Manutenção', ativo: getElementSafely('servico-manutencao')?.checked || false, preco: parseFloat(document.querySelector('#servico-manutencao + label + input')?.value) || 50 },
                { id: 'esmaltacao', nome: 'Esmaltação em gel', ativo: getElementSafely('servico-esmaltacao')?.checked || false, preco: parseFloat(document.querySelector('#servico-esmaltacao + label + input')?.value) || 40 }
            ]
        };

        localStorage.setItem('configuracoes', JSON.stringify(config));
        alert('Configurações salvas com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
    }
}

// Resetar configurações
function resetarConfiguracoes() {
    try {
        if (!confirm('Tem certeza que deseja restaurar as configurações padrão?')) return;

        const configPadrao = getConfiguracoesPadrao();
        localStorage.setItem('configuracoes', JSON.stringify(configPadrao));
        carregarConfiguracoes();
        alert('Configurações restauradas com sucesso!');
    } catch (error) {
        console.error('Erro ao resetar configurações:', error);
    }
}



// Função para enviar agendamento via WhatsApp
function enviarWhatsApp(agendamento) {
    const nome = agendamento.nome;
    const telefone = agendamento.telefone;
    const data = agendamento.data;
    const hora = agendamento.hora;
    const servico = agendamento.servico;

    // Substitua pelo seu número com DDD e sem espaços, exemplo: 5538992702823
    const numeroWhatsApp = '5538992702823';

    const mensagem = `Olá! Gostaria de agendar um horário:%0A` +
        `*Nome:* ${nome}%0A` +
        `*Telefone:* ${telefone}%0A` +
        `*Data:* ${data}%0A` +
        `*Horário:* ${hora}%0A` +
        `*Serviço:* ${servico}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    window.open(url, '_blank');
}

function salvarAgendamentoLocal(agendamento) {
    try {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        agendamentos.push(agendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        console.log('Agendamento salvo com sucesso:', agendamento);
        console.log('Total de agendamentos:', agendamentos.length);
        return true;
    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        return false;
    }
}

// Função para salvar lembrete de agendamento
function salvarLembreteAgendamento(agendamento) {
    try {
        let lembretes = JSON.parse(localStorage.getItem('lembretes_agendamentos')) || [];

        // Criar objeto do lembrete
        const lembrete = {
            id: Date.now() + Math.random(), // ID único
            nome: agendamento.nome,
            telefone: agendamento.telefone,
            data: agendamento.data,
            hora: agendamento.hora,
            servico: agendamento.servico,
            dataCriacao: new Date().toISOString(),
            dataFormatada: formatarData(agendamento.data),
            status: 'pendente', // pendente, enviado, cancelado
            tipo: 'whatsapp'
        };

        lembretes.push(lembrete);
        localStorage.setItem('lembretes_agendamentos', JSON.stringify(lembretes));

        console.log('Lembrete salvo com sucesso:', lembrete);
        return true;
    } catch (error) {
        console.error('Erro ao salvar lembrete:', error);
        return false;
    }
}

// Função para verificar lembretes pendentes
function verificarLembretesPendentes() {
    try {
        const lembretes = JSON.parse(localStorage.getItem('lembretes_agendamentos')) || [];
        const hoje = new Date();
        const hojeFormatada = hoje.toISOString().split('T')[0]; // YYYY-MM-DD

        const lembretesPendentes = lembretes.filter(lembrete => {
            // Verificar se é para hoje ou amanhã e ainda não foi enviado
            const dataLembrete = new Date(lembrete.data);
            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);

            return (lembrete.data === hojeFormatada || lembrete.data === amanha.toISOString().split('T')[0])
                && lembrete.status === 'pendente';
        });

        return lembretesPendentes;
    } catch (error) {
        console.error('Erro ao verificar lembretes:', error);
        return [];
    }
}

// Função para enviar lembrete via WhatsApp
function enviarLembreteWhatsApp(lembrete) {
    const nome = lembrete.nome;
    const telefone = lembrete.telefone;
    const data = lembrete.dataFormatada;
    const hora = lembrete.hora;
    const servico = lembrete.servico;

    // Função para obter o número da cliente do lembrete
    function getNumeroCliente(lembrete) {
        if (!lembrete.telefone) return '';

        // Remove todos os caracteres não numéricos
        let numero = lembrete.telefone.replace(/\D/g, '');

        // Se o número tem 11 dígitos e começa com 0, remove o 0
        if (numero.length === 11 && numero.startsWith('0')) {
            numero = numero.substring(1);
        }

        // Se o número tem 10 dígitos, adiciona o código do país (55 para Brasil)
        if (numero.length === 10) {
            numero = '55' + numero;
        }

        // Se o número tem 11 dígitos e não começa com 55, adiciona o código do país
        if (numero.length === 11 && !numero.startsWith('55')) {
            numero = '55' + numero;
        }

        return numero;
    }

    const numeroCliente = getNumeroCliente(lembrete);

    // Verificar se o número é válido (deve ter pelo menos 12 dígitos com código do país)
    if (!numeroCliente || numeroCliente.length < 12) {
        console.error('Número de telefone inválido:', telefone, 'Número processado:', numeroCliente);
        alert(`Número de telefone inválido para envio do lembrete: ${telefone}`);
        return null;
    }

    const mensagem = `Olá ${nome}! 😊%0A%0A` +
        `*LEMBRETE DE AGENDAMENTO* 📅%0A%0A` +
        `Você tem um horário marcado:%0A` +
        `📅 *Data:* ${data}%0A` +
        `⏰ *Horário:* ${hora}%0A` +
        `💅 *Serviço:* ${servico}%0A%0A` +
        `Por favor, confirme se poderá comparecer.%0A` +
        `Em caso de cancelamento, entre em contato com antecedência.%0A%0A` +
        `Aguardo você! 💕%0A` +
        `Ana Livia - Livía Nail Art`;

    const url = `https://wa.me/${numeroCliente}?text=${mensagem}`;

    // Não marcar como enviado automaticamente - permite reenvios
    // marcarLembreteComoEnviado(lembrete.id);

    return url;
}

// Função para marcar lembrete como enviado
function marcarLembreteComoEnviado(lembreteId) {
    try {
        let lembretes = JSON.parse(localStorage.getItem('lembretes_agendamentos')) || [];

        const lembreteIndex = lembretes.findIndex(l => l.id === lembreteId);
        if (lembreteIndex !== -1) {
            lembretes[lembreteIndex].status = 'enviado';
            lembretes[lembreteIndex].dataEnvio = new Date().toISOString();
            localStorage.setItem('lembretes_agendamentos', JSON.stringify(lembretes));
            console.log(`Lembrete ${lembreteId} marcado como enviado`);
        }
    } catch (error) {
        console.error('Erro ao marcar lembrete como enviado:', error);
    }
}

// Função para mostrar painel de lembretes
function mostrarPainelLembretes() {
    const lembretesPendentes = verificarLembretesPendentes();

    if (lembretesPendentes.length === 0) {
        return;
    }

    // Criar ou atualizar painel de lembretes
    let painelLembretes = document.getElementById('painel-lembretes');
    if (!painelLembretes) {
        painelLembretes = document.createElement('div');
        painelLembretes.id = 'painel-lembretes';
        painelLembretes.className = 'painel-lembretes';
        document.body.appendChild(painelLembretes);
    }

    painelLembretes.innerHTML = `
        <div class="lembretes-header">
            <h3>📅 Lembretes de Agendamentos</h3>
            <button class="btn-fechar-lembretes" onclick="fecharPainelLembretes()">×</button>
        </div>
        <div class="lembretes-content">
            ${lembretesPendentes.map(lembrete => `
                <div class="lembrete-item">
                    <div class="lembrete-info">
                        <strong>${lembrete.nome}</strong>
                        <p>📅 ${lembrete.dataFormatada} às ${lembrete.hora}</p>
                        <p>💅 ${lembrete.servico}</p>
                        <p>📱 ${lembrete.telefone}</p>
                    </div>
                    <div class="lembrete-acoes">
                        <button class="btn-enviar-lembrete" onclick="enviarLembreteIndividual(${lembrete.id})">
                            📱 Enviar Lembrete
                        </button>
                        <button class="btn-cancelar-lembrete" onclick="cancelarLembrete(${lembrete.id})">
                            ❌ Cancelar
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="lembretes-footer">
            <button class="btn-enviar-todos" onclick="enviarTodosLembretes()">
                📱 Enviar Todos os Lembretes
            </button>
        </div>
    `;

    painelLembretes.style.display = 'block';
}

// Função para fechar painel de lembretes
function fecharPainelLembretes() {
    const painelLembretes = document.getElementById('painel-lembretes');
    if (painelLembretes) {
        painelLembretes.style.display = 'none';
    }
}

// Função para enviar lembrete individual
function enviarLembreteIndividual(lembreteId) {
    try {
        const lembretes = JSON.parse(localStorage.getItem('lembretes_agendamentos')) || [];
        const lembrete = lembretes.find(l => l.id === lembreteId);

        if (lembrete) {
            const url = enviarLembreteWhatsApp(lembrete);
            window.open(url, '_blank');

            // Atualizar painel
            setTimeout(() => {
                mostrarPainelLembretes();
            }, 1000);
        }
    } catch (error) {
        console.error('Erro ao enviar lembrete individual:', error);
    }
}

// Função para cancelar lembrete
function cancelarLembrete(lembreteId) {
    try {
        let lembretes = JSON.parse(localStorage.getItem('lembretes_agendamentos')) || [];

        const lembreteIndex = lembretes.findIndex(l => l.id === lembreteId);
        if (lembreteIndex !== -1) {
            lembretes[lembreteIndex].status = 'cancelado';
            lembretes[lembreteIndex].dataCancelamento = new Date().toISOString();
            localStorage.setItem('lembretes_agendamentos', JSON.stringify(lembretes));

            // Atualizar painel
            mostrarPainelLembretes();
        }
    } catch (error) {
        console.error('Erro ao cancelar lembrete:', error);
    }
}

// Função para enviar todos os lembretes
function enviarTodosLembretes() {
    const lembretesPendentes = verificarLembretesPendentes();

    if (lembretesPendentes.length === 0) {
        alert('Não há lembretes pendentes para enviar.');
        return;
    }

    if (confirm(`Deseja enviar ${lembretesPendentes.length} lembrete(s) via WhatsApp?`)) {
        lembretesPendentes.forEach(lembrete => {
            const url = enviarLembreteWhatsApp(lembrete);
            // Abrir em nova aba com delay para evitar bloqueio
            setTimeout(() => {
                window.open(url, '_blank');
            }, 1000);
        });

        setTimeout(() => {
            mostrarPainelLembretes();
        }, 2000);
    }
}

// Variáveis globais para o calendário
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

// Função para formatar data no formato brasileiro
function formatarData(dataISO) {
    try {
        // Verificar se a data já está no formato correto
        if (!dataISO || typeof dataISO !== 'string') {
            console.error('Data inválida:', dataISO);
            return 'Data inválida';
        }

        // Se a data já estiver no formato DD/MM/YYYY, retornar como está
        if (dataISO.includes('/')) {
            return dataISO;
        }

        // Processar data no formato YYYY-MM-DD sem problemas de fuso horário
        const partes = dataISO.split('-');
        if (partes.length !== 3) {
            console.error('Formato de data inválido:', dataISO);
            return dataISO;
        }

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        // Verificar se os valores são válidos
        if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
            console.error('Valores de data inválidos:', dataISO);
            return dataISO;
        }

        console.log(`Formatando data: ${dataISO} -> ${dia}/${mes}/${ano}`);
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error, 'Data original:', dataISO);
        return dataISO; // Retorna a data original se houver erro
    }
}

// Função para mostrar agendamentos
function mostrarAgendamentos(dataFiltro = null) {
    const lista = document.getElementById('lista-agendamentos');
    if (!lista) return;

    lista.innerHTML = '';

    // Se não há data filtro, não mostra nada e esconde o título
    if (!dataFiltro) {
        const tituloAgenda = document.querySelectorAll('#titulo-agendamentos');
        tituloAgenda.forEach(t => t.style.display = 'none');
        return;
    }

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    if (agendamentos.length === 0) {
        return;
    }

    // Filtrar agendamentos por data
    const agendamentosFiltrados = agendamentos.filter(a => a.data === dataFiltro);

    if (agendamentosFiltrados.length === 0) {
        return;
    }

    // Mostrar título da seção de agendamentos
    const tituloAgenda = document.querySelectorAll('#titulo-agendamentos');
    if (tituloAgenda.length > 0) {
        const dataFormatada = formatarData(dataFiltro);
        tituloAgenda.forEach(t => {
            t.textContent = `Agendamentos para ${dataFormatada}`;
            t.style.display = 'block';
        });
    }

    // Ordenar agendamentos por hora
    agendamentosFiltrados.sort((a, b) => {
        return a.hora.localeCompare(b.hora);
    });

    agendamentosFiltrados.forEach((a, i) => {
        const li = document.createElement('li');
        li.textContent = `${a.hora} - ${a.nome} (${a.servico})`;
        lista.appendChild(li);
    });
}

// Função para gerar o calendário
function gerarCalendario(mes, ano) {
    const diasCalendario = document.getElementById('dias-calendario');
    const mesAtualElement = document.getElementById('mes-atual');

    if (!diasCalendario || !mesAtualElement) return;

    // Nomes dos meses
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Atualizar título do mês
    mesAtualElement.textContent = `${nomesMeses[mes]} ${ano}`;

    // Obter primeiro dia do mês e último dia
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diaSemanaInicio = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    // Obter agendamentos para marcar no calendário
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const agendamentosPorDia = {};

    agendamentos.forEach(agendamento => {
        // Extrair ano, mês e dia da string de data sem problemas de fuso horário
        const partes = agendamento.data.split('-');
        if (partes.length === 3) {
            const anoAgendamento = parseInt(partes[0]);
            const mesAgendamento = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
            const diaAgendamento = parseInt(partes[2]);

            if (mesAgendamento === mes && anoAgendamento === ano) {
                if (!agendamentosPorDia[diaAgendamento]) {
                    agendamentosPorDia[diaAgendamento] = [];
                }
                agendamentosPorDia[diaAgendamento].push(agendamento);
            }
        }
    });

    // Limpar calendário
    diasCalendario.innerHTML = '';

    // Adicionar dias do mês anterior (para completar a primeira semana)
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        const dia = document.createElement('div');
        dia.className = 'dia-calendario outro-mes';
        dia.textContent = ultimoDiaMesAnterior - i;
        diasCalendario.appendChild(dia);
    }

    // Adicionar dias do mês atual
    const hoje = new Date();
    // Para destacar o dia selecionado
    const dataInput = document.getElementById('data-agendamento');
    let dataSelecionada = null;
    if (dataInput && dataInput.value) {
        const partes = dataInput.value.split('-');
        if (partes.length === 3) {
            const anoSelecionado = parseInt(partes[0]);
            const mesSelecionado = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
            const diaSelecionado = parseInt(partes[2]);
            dataSelecionada = new Date(anoSelecionado, mesSelecionado, diaSelecionado);
        }
    }
    for (let dia = 1; dia <= totalDias; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario';
        diaElement.textContent = dia;

        // Marcar como hoje
        if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
            diaElement.classList.add('hoje');
        }

        // Marcar dias com agendamentos
        if (agendamentosPorDia[dia]) {
            diaElement.classList.add('com-agendamento');

            // Criar tooltip detalhado com horários ocupados
            const horariosOcupados = agendamentosPorDia[dia].map(a => a.hora).sort();
            const tooltipText = `${agendamentosPorDia[dia].length} agendamento(s)\nHorários ocupados: ${horariosOcupados.join(', ')}`;
            diaElement.title = tooltipText;
        }

        // Destacar o dia selecionado
        if (
            dataSelecionada &&
            dia === dataSelecionada.getDate() &&
            mes === dataSelecionada.getMonth() &&
            ano === dataSelecionada.getFullYear()
        ) {
            diaElement.classList.add('selecionado');
        }

        // Permitir selecionar apenas dias válidos (não passados, não finais de semana)
        const dataDoDia = new Date(ano, mes, dia);
        const hojeLimpo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        if (dataDoDia >= hojeLimpo && dataDoDia.getDay() !== 0) {
            diaElement.style.cursor = 'pointer';
            diaElement.addEventListener('click', function () {
                // Preencher o input de data
                if (dataInput) {
                    const yyyy = ano;
                    const mm = String(mes + 1).padStart(2, '0');
                    const dd = String(dia).padStart(2, '0');
                    const dataSelecionada = `${yyyy}-${mm}-${dd}`;
                    dataInput.value = dataSelecionada;

                    // Mostrar horários disponíveis para esta data
                    mostrarHorariosDisponiveis(dataSelecionada);

                    // Mostrar apenas os agendamentos do dia selecionado
                    mostrarAgendamentos(dataSelecionada);

                    // Disparar evento para atualizar restrições de horário
                    dataInput.dispatchEvent(new Event('input'));
                }
                // Atualizar destaque visual
                const todosDias = document.querySelectorAll('.dia-calendario');
                todosDias.forEach(d => d.classList.remove('selecionado'));
                diaElement.classList.add('selecionado');
            });
        } else {
            diaElement.style.opacity = 0.5;
        }

        diasCalendario.appendChild(diaElement);
    }

    // Adicionar dias do próximo mês (para completar a última semana)
    const diasRestantes = 42 - (diaSemanaInicio + totalDias); // 6 semanas * 7 dias
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario outro-mes';
        diaElement.textContent = dia;
        diasCalendario.appendChild(diaElement);
    }
}

// Sistema de horários disponíveis por dia
const HORARIOS_DISPONIVEIS = [
    '07:30', '10:00', '13:30', '15:00', '17:30'
];

// Função para obter horários disponíveis de um dia específico
function getHorariosDisponiveis(data) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const agendamentosDoDia = agendamentos.filter(a => a.data === data);
    const horariosOcupados = agendamentosDoDia.map(a => a.hora);

    return HORARIOS_DISPONIVEIS.filter(horario => !horariosOcupados.includes(horario));
}

// Função para mostrar horários disponíveis quando um dia é selecionado
function mostrarHorariosDisponiveis(data) {
    const horariosDisponiveis = getHorariosDisponiveis(data);
    const horaInput = document.getElementById('hora-agendamento');
    const container = document.getElementById('horarios-disponiveis-container');
    const lista = document.getElementById('horarios-disponiveis-lista');
    const totalSpan = document.getElementById('total-horarios');

    if (horaInput) {
        // Limpar opções existentes
        horaInput.innerHTML = '';

        // Adicionar opção padrão
        const optionPadrao = document.createElement('option');
        optionPadrao.value = '';
        optionPadrao.textContent = 'Selecione um horário';
        horaInput.appendChild(optionPadrao);

        // Adicionar horários disponíveis
        horariosDisponiveis.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;
            horaInput.appendChild(option);
        });

        // Mostrar data selecionada
        const dataSelecionadaTexto = document.getElementById('data-selecionada-texto');
        if (dataSelecionadaTexto) {
            const dataFormatada = formatarData(data);
            dataSelecionadaTexto.textContent = dataFormatada;
        }
    }

    // Mostrar container de horários disponíveis
    if (container && lista && totalSpan) {
        // Limpar lista anterior
        lista.innerHTML = '';

        if (horariosDisponiveis.length > 0) {
            // Mostrar container
            container.style.display = 'block';

            // Adicionar horários como badges
            horariosDisponiveis.forEach(horario => {
                const badge = document.createElement('span');
                badge.textContent = horario;
                badge.style.cssText = `
                    display: inline-block;
                    padding: 6px 12px;
                    background:#bb6888;
                    color: white;
                    border-radius: 20px;
                    font-size: 14px;    
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                `;



                // Selecionar horário ao clicar
                badge.addEventListener('click', () => {
                    if (horaInput) {
                        // Remover seleção anterior
                        const todosBadges = document.querySelectorAll('#horarios-disponiveis-lista span');
                        todosBadges.forEach(b => {
                            b.style.background = '#007bff';
                            b.style.border = 'none';
                        });

                        // Destacar badge selecionado
                        badge.style.background = '#28a745';
                        badge.style.border = '2px solid #1e7e34';

                        horaInput.value = horario;

                        // Mostrar horário selecionado
                        const horarioSelecionado = document.getElementById('horario-selecionado');
                        if (horarioSelecionado) {
                            horarioSelecionado.textContent = `Horário selecionado: ${horario}`;
                            horarioSelecionado.style.display = 'block';
                        }

                        // Disparar evento para validar
                        horaInput.dispatchEvent(new Event('change'));
                    }
                });

                lista.appendChild(badge);
            });

            // Atualizar total
            totalSpan.textContent = horariosDisponiveis.length;
        } else {
            // Mostrar mensagem quando não há horários disponíveis
            container.style.display = 'block';

            const mensagem = document.createElement('div');
            mensagem.style.cssText = `
                padding: 10px;
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                text-align: center;
                font-weight: 500;
            `;
            mensagem.textContent = 'Não há horários disponíveis para esta data.';
            lista.appendChild(mensagem);

            // Atualizar total
            totalSpan.textContent = '0';
        }
    }
}

// Função para selecionar serviço automaticamente ao clicar na imagem
function selecionarServicoPorImagem(servicoNome) {
    const selectServico = document.getElementById('servico-agendamento');
    if (selectServico) {
        // Mapeamento de nomes para garantir correspondência
        const mapeamentoServicos = {
            'Molde F1': 'Molde F1',
            'Fibra de vidro': 'Fibra de vidro',
            'Banho em gel': 'Banho em gel',
            'Manutenção': 'Manutenção',
            'esmaltação em gel': 'Esmaltação em gel'
        };

        // Usar o nome mapeado ou o original
        const nomeParaBuscar = mapeamentoServicos[servicoNome] || servicoNome;

        // Encontrar a opção correspondente ao serviço
        const opcoes = selectServico.options;
        for (let i = 0; i < opcoes.length; i++) {
            if (opcoes[i].value === nomeParaBuscar) {
                selectServico.selectedIndex = i;

                // Adicionar classe visual para feedback
                selectServico.classList.add('selecionado');

                // Mostrar mensagem de confirmação
                mostrarMensagemServicoSelecionado(servicoNome);

                // Rolar para a seção de agendamento
                const secaoAgendamento = document.getElementById('agendamento');
                if (secaoAgendamento) {
                    secaoAgendamento.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Remover classe após 3 segundos
                setTimeout(() => {
                    selectServico.classList.remove('selecionado');
                }, 3000);

                console.log(`Serviço "${servicoNome}" selecionado automaticamente`);
                break;
            }
        }
    }
}

// Função para mostrar mensagem de serviço selecionado
function mostrarMensagemServicoSelecionado(servicoNome) {
    // Remover mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem-servico-selecionado');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-servico-selecionado';
    mensagem.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Serviço "${servicoNome}" selecionado!
    `;

    // Adicionar ao body
    document.body.appendChild(mensagem);

    // Remover mensagem após 3 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.remove();
        }
    }, 3000);
}

// Função para inicializar os event listeners das imagens de serviços
function inicializarSelecaoDeServicos() {
    const imagensServicos = document.querySelectorAll('.service-item-img');

    console.log(`Encontradas ${imagensServicos.length} imagens de serviços para inicializar`);

    imagensServicos.forEach((img, index) => {
        img.addEventListener('click', function () {
            // Encontrar o título do serviço
            const serviceItem = this.closest('.service-item');
            const tituloServico = serviceItem.querySelector('.service-item-title');

            if (tituloServico) {
                const nomeServico = tituloServico.textContent.trim();
                console.log(`Clique detectado na imagem ${index + 1}: "${nomeServico}"`);
                selecionarServicoPorImagem(nomeServico);
            }
        });

        // Adicionar cursor pointer para indicar que é clicável
        img.style.cursor = 'pointer';

        // Adicionar título para acessibilidade
        const serviceItem = img.closest('.service-item');
        const tituloServico = serviceItem.querySelector('.service-item-title');
        if (tituloServico) {
            img.title = `Clique para selecionar: ${tituloServico.textContent.trim()}`;
        }
    });
}

// Adiciona o evento ao formulário de agendamento, se existir na página
document.addEventListener('DOMContentLoaded', function () {
    const formAgendamento = document.getElementById('form-agendamento');

    if (formAgendamento) {
        // Remove event listeners anteriores para evitar duplicação
        formAgendamento.removeEventListener('submit', handleFormSubmit);

        // Adiciona o novo event listener
        formAgendamento.addEventListener('submit', handleFormSubmit);

        // Inicializa lista de agendamentos (vazia até selecionar data)
        mostrarAgendamentos();
    }

    // Função unificada para lidar com o envio do formulário
    function handleFormSubmit(event) {
        event.preventDefault();

        const nome = document.getElementById('nome-agendamento').value;
        const telefone = document.getElementById('telefone-agendamento').value;
        const data = document.getElementById('data-agendamento').value;
        const hora = document.getElementById('hora-agendamento').value;
        const servico = document.getElementById('servico-agendamento').value;

        // Validações
        if (!nome || !telefone || !data || !hora || !servico) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verificar se uma data foi selecionada
        if (!data) {
            alert('Por favor, selecione uma data no calendário.');
            return;
        }

        // Validação de data sem problemas de fuso horário
        const partes = data.split('-');
        if (partes.length !== 3) {
            alert('Data inválida.');
            return;
        }

        const anoSelecionado = parseInt(partes[0]);
        const mesSelecionado = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
        const diaSelecionado = parseInt(partes[2]);

        // Criar data para validação
        const dataSelecionada = new Date(anoSelecionado, mesSelecionado, diaSelecionado);
        const diaSemana = dataSelecionada.getDay();

        // Data de hoje para comparação
        const hoje = new Date();
        const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        if (dataSelecionada < dataHoje) {
            alert('Não é possível agendar para dias que já passaram.');
            return;
        }

        if (diaSemana === 0 || diaSemana === 6) {
            alert('Selecione um dia útil (segunda a sexta-feira).');
            return;
        }

        // Validação de horário
        if (hora < "07:30" || hora > "18:00" || (hora >= "12:00" && hora < "13:30")) {
            alert('Selecione um horário entre 07:30 e 12:00 ou entre 13:30 e 18:00 (horário de almoço bloqueado).');
            return;
        }

        // Verificar se horário já está agendado
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const existe = agendamentos.some(a => a.data === data && a.hora === hora);
        if (existe) {
            alert('Este horário já está agendado para esta data. Escolha outro horário.');
            return;
        }

        // Criar objeto do agendamento
        const agendamento = {
            nome,
            telefone,
            data: data, // Data no formato YYYY-MM-DD
            hora,
            servico,
            dataCriacao: new Date().toISOString(),
            dataFormatada: formatarData(data) // Data formatada para exibição
        };

        // Debug: mostrar dados que serão salvos
        console.log('Dados do agendamento a serem salvos:', agendamento);
        console.log('Data original:', data);
        console.log('Data formatada:', formatarData(data));

        // Salvar localmente
        const salvou = salvarAgendamentoLocal(agendamento);

        if (salvou) {
            // Criar lembrete automaticamente
            salvarLembreteAgendamento(agendamento);

            // Atualizar interface
            mostrarAgendamentos(data); // Mostrar agendamentos da data atual após salvar
            gerarCalendario(mesAtual, anoAtual);

            // Limpar formulário
            formAgendamento.reset();

            // Se ainda há uma data selecionada, atualizar os horários disponíveis
            const dataAtual = document.getElementById('data-agendamento').value;
            if (dataAtual) {
                mostrarHorariosDisponiveis(dataAtual);
            }

            // Limpar texto da data selecionada
            const dataSelecionadaTexto = document.getElementById('data-selecionada-texto');
            if (dataSelecionadaTexto) {
                dataSelecionadaTexto.textContent = 'Nenhuma data selecionada';
            }

            // Limpar seleção do select de horários
            const horaInput = document.getElementById('hora-agendamento');
            if (horaInput) {
                horaInput.innerHTML = '<option value="">Selecione uma data primeiro</option>';
            }

            // Esconder container de horários disponíveis
            const container = document.getElementById('horarios-disponiveis-container');
            if (container) {
                container.style.display = 'none';
            }

            // Remover destaque do dia selecionado
            const todosDias = document.querySelectorAll('.dia-calendario');
            todosDias.forEach(d => d.classList.remove('selecionado'));

            // Mostrar confirmação
            alert('Agendamento salvo com sucesso!');

            // Enviar via WhatsApp
            enviarWhatsApp(agendamento);
        } else {
            alert('Erro ao salvar agendamento. Tente novamente.');
        }
    }

    // Bloqueio de horários fora do expediente (08h às 17h), horário de almoço (12h às 13h) e horários já agendados

    const dataInput = document.getElementById('data-agendamento');
    const horaInput = document.getElementById('hora-agendamento');

    // Função para obter agendamentos salvos
    function getAgendamentos() {
        return JSON.parse(localStorage.getItem('agendamentos')) || [];
    }

    // Bloqueia horários fora do intervalo 07:30 às 18:00, horário de almoço 12:00 às 13:30 e horários já agendados
    if (horaInput) {
        horaInput.min = "07:30";
        horaInput.max = "18:00";
        horaInput.addEventListener('input', function () {
            const hora = this.value;
            const data = dataInput.value;

            // Verificar se uma data foi selecionada
            if (!data) {
                alert('Por favor, selecione uma data no calendário primeiro.');
                this.value = '';
                return;
            }

            if (hora < "07:30" || hora > "18:00" || (hora >= "12:00" && hora < "13:30")) {
                alert('Selecione um horário entre 07:30 e 12:00 ou entre 13:30 e 18:00 (horário de almoço bloqueado).');
                this.value = '';
                return;
            }
            // Bloqueio de horários já agendados
            const agendamentos = getAgendamentos();
            const existe = agendamentos.some(a => a.data === data && a.hora === hora);
            if (existe) {
                alert('Este horário já está agendado para esta data. Escolha outro horário.');
                this.value = '';
            }
        });
    }

    // Inicializar calendário
    gerarCalendario(mesAtual, anoAtual);

    // Event listeners para navegação do calendário
    const btnMesAnterior = document.getElementById('mes-anterior');
    const btnMesProximo = document.getElementById('mes-proximo');

    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', function () {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            gerarCalendario(mesAtual, anoAtual);
        });
    }

    if (btnMesProximo) {
        btnMesProximo.addEventListener('click', function () {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            gerarCalendario(mesAtual, anoAtual);
        });
    }

    // Inicializar seleção de serviços por imagem
    inicializarSelecaoDeServicos();
});

